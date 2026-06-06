import { readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { neon } from '@neondatabase/serverless';
import { loadEnvLocal } from '../src/db/env';
import { uploadImage } from '../src/admin/images';

// uploads /images/* rows to the blob store, once per environment so envs never share blobs
loadEnvLocal();
const url = process.env.DATABASE_URL;
if (!url || !process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('DATABASE_URL and BLOB_READ_WRITE_TOKEN must be set (env or .env.local).');
  process.exit(1);
}
const sql = neon(url);
const publicDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

const TARGETS = [
  { table: 'site_settings', column: 'profile_image' },
  { table: 'certifications', column: 'img_path' },
  { table: 'projects', column: 'image_path' },
] as const;

function mimeType(path: string): string {
  if (path.endsWith('.webp')) return 'image/webp';
  if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg';
  return 'image/png';
}

async function main(): Promise<void> {
  let failures = 0;
  for (const { table, column } of TARGETS) {
    const rows = (await sql.query(
      `SELECT id, ${column} AS path FROM ${table} WHERE ${column} LIKE '/images/%'`,
    )) as { id: number; path: string }[];
    for (const row of rows) {
      let buffer: Buffer;
      try {
        buffer = readFileSync(join(publicDir, row.path));
      } catch {
        console.error(`${table}.${column} #${row.id}: missing file public${row.path}`);
        failures += 1;
        continue;
      }
      const file = new File([buffer], basename(row.path), { type: mimeType(row.path) });
      const blobUrl = await uploadImage(file);
      await sql.query(`UPDATE ${table} SET ${column} = $1 WHERE id = $2`, [blobUrl, row.id]);
      console.log(`${table}.${column} #${row.id}: ${row.path} -> ${blobUrl}`);
    }
  }
  if (failures > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
