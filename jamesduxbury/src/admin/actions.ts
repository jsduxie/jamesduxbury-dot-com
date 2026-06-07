'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth, isAdminSession } from '@/auth';
import { markRead } from '@/db/messages';
import { SITE_ROUTES } from '@/lib/site';
import { parseFields, type FieldDef, type FieldValue } from './fields';
import { deleteImage, documentFileError, imageFileError, uploadImage } from './images';
import { getSection } from './sections';
import { deleteRow, getRow, insertRow, makeRoomAt, updateRow } from './sql';

export interface FormState {
  message: string | null;
  fieldErrors: Record<string, string>;
}

async function requireAdmin(): Promise<void> {
  if (!isAdminSession(await auth())) throw new Error('Unauthorised');
}

function uploadFields(fields: FieldDef[]): FieldDef[] {
  return fields.filter((f) => f.type === 'image' || f.type === 'document');
}

function revalidatePublicPages(): void {
  for (const route of SITE_ROUTES) revalidatePath(route);
}

// serialises jsonb field values to JSON strings
function toSqlValues(fields: FieldDef[], data: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    const value = data[f.column];
    out[f.column] =
      (f.type === 'metrics' || f.type === 'runs' || f.type === 'prose') && value !== null
        ? JSON.stringify(value)
        : value;
  }
  return out;
}

export async function saveItem(
  slug: string,
  id: number | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const section = getSection(slug);

  const values = parseFields(section.fields, formData);
  const images = uploadFields(section.fields);
  const files = new Map<string, File>();
  for (const f of images) {
    const raw = formData.get(f.column);
    if (raw instanceof File && raw.size > 0) {
      const error = f.type === 'document' ? documentFileError(raw) : imageFileError(raw);
      if (error) return { message: 'Validation failed', fieldErrors: { [f.column]: error } };
      files.set(f.column, raw);
    }
  }
  // an empty file input keeps the stored image
  const prior = id !== null && images.length > 0 ? await getRow(section.table, id) : null;
  for (const f of images) {
    if (!files.has(f.column)) values[f.column] = (prior?.[f.column] as FieldValue) ?? null;
  }

  const parsed = section.schema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? '');
      if (key && !(key in fieldErrors)) fieldErrors[key] = issue.message;
    }
    return { message: 'Validation failed', fieldErrors };
  }

  const uploaded: string[] = [];
  try {
    const row = toSqlValues(section.fields, parsed.data);
    for (const [column, file] of files) {
      const url = await uploadImage(file);
      uploaded.push(url);
      row[column] = url;
    }
    const sortOrder = row.sort_order;
    if (typeof sortOrder === 'number') await makeRoomAt(section.table, sortOrder, id);
    if (id === null) await insertRow(section.table, row);
    else await updateRow(section.table, id, row);
  } catch (err) {
    // a failed save must not leave blobs the row never referenced
    for (const url of uploaded) await deleteImage(url);
    return { message: err instanceof Error ? err.message : 'Save failed', fieldErrors: {} };
  }

  if (prior !== null) for (const column of files.keys()) await deleteImage(prior[column]);

  revalidatePublicPages();
  revalidatePath(`/admin/${slug}`);
  redirect(`/admin/${slug}`);
}

export async function deleteItem(slug: string, id: number): Promise<void> {
  await requireAdmin();
  const section = getSection(slug);
  const images = uploadFields(section.fields);
  const row = images.length > 0 ? await getRow(section.table, id) : null;
  await deleteRow(section.table, id);
  for (const f of images) await deleteImage(row?.[f.column]);
  revalidatePublicPages();
  revalidatePath(`/admin/${slug}`);
}

export async function markMessageRead(id: number): Promise<void> {
  await requireAdmin();
  await markRead(id);
  revalidatePath('/admin/messages');
}
