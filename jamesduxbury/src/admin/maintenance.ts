import { z } from 'zod';
import { getSql } from '@/db';
import { SECTIONS } from './sections';
import { blobIsAlive, deleteImage, isBlobUrl, listEnvBlobs } from './images';

interface UploadRef {
  table: string;
  column: string;
  // non-nullable columns (profile_image) are reported rather than nulled
  nullable: boolean;
}

function uploadRefs(): UploadRef[] {
  const refs: UploadRef[] = [];
  for (const section of SECTIONS) {
    const shape = (section.schema as unknown as z.ZodObject<z.ZodRawShape>).shape as Record<
      string,
      z.ZodType
    >;
    for (const field of section.fields) {
      if (field.type !== 'image' && field.type !== 'document') continue;
      refs.push({
        table: section.table,
        column: field.column,
        nullable: shape[field.column].safeParse(null).success,
      });
    }
  }
  return refs;
}

// every store-owned blob URL currently referenced by a row, mapped to its references
async function referencedUrls(): Promise<Map<string, UploadRef[]>> {
  const map = new Map<string, UploadRef[]>();
  for (const ref of uploadRefs()) {
    const rows = (await getSql().query(
      `SELECT DISTINCT ${ref.column} AS url FROM ${ref.table} WHERE ${ref.column} IS NOT NULL`,
    )) as { url: string }[];
    for (const { url } of rows) {
      if (!isBlobUrl(url)) continue;
      const pointers = map.get(url) ?? [];
      pointers.push(ref);
      map.set(url, pointers);
    }
  }
  return map;
}

export interface MaintenanceReport {
  healed: { table: string; column: string }[];
  dangling: { table: string; column: string; url: string }[];
  purged: number;
}

// nulls references whose blob has vanished, then deletes blobs no row references
export async function runBlobMaintenance(): Promise<MaintenanceReport> {
  const report: MaintenanceReport = { healed: [], dangling: [], purged: 0 };

  for (const [url, pointers] of await referencedUrls()) {
    if (await blobIsAlive(url)) continue;
    for (const ref of pointers) {
      if (ref.nullable) {
        await getSql().query(
          `UPDATE ${ref.table} SET ${ref.column} = NULL WHERE ${ref.column} = $1`,
          [url],
        );
        report.healed.push({ table: ref.table, column: ref.column });
      } else {
        report.dangling.push({ table: ref.table, column: ref.column, url });
      }
    }
  }

  const referenced = new Set((await referencedUrls()).keys());
  for (const url of await listEnvBlobs()) {
    if (referenced.has(url)) continue;
    await deleteImage(url);
    report.purged += 1;
  }
  return report;
}
