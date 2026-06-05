'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth, isAdminSession } from '@/auth';
import { getSql } from '@/db';
import { SITE_ROUTES } from '@/lib/site';
import { parseFields, type FieldDef } from './fields';
import { getSection } from './sections';
import { deleteRow, insertRow, makeRoomAt, updateRow } from './sql';

export interface FormState {
  message: string | null;
  fieldErrors: Record<string, string>;
}

async function requireAdmin(): Promise<void> {
  if (!isAdminSession(await auth())) throw new Error('Unauthorised');
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
      (f.type === 'metrics' || f.type === 'runs') && value !== null ? JSON.stringify(value) : value;
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
  const parsed = section.schema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? '');
      if (key && !(key in fieldErrors)) fieldErrors[key] = issue.message;
    }
    return { message: 'Validation failed', fieldErrors };
  }

  try {
    const row = toSqlValues(section.fields, parsed.data);
    const sortOrder = row.sort_order;
    if (typeof sortOrder === 'number') await makeRoomAt(section.table, sortOrder, id);
    if (id === null) await insertRow(section.table, row);
    else await updateRow(section.table, id, row);
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Save failed', fieldErrors: {} };
  }

  revalidatePublicPages();
  revalidatePath(`/admin/${slug}`);
  redirect(`/admin/${slug}`);
}

export async function deleteItem(slug: string, id: number): Promise<void> {
  await requireAdmin();
  const section = getSection(slug);
  await deleteRow(section.table, id);
  revalidatePublicPages();
  revalidatePath(`/admin/${slug}`);
}

export async function markMessageRead(id: number): Promise<void> {
  await requireAdmin();
  await getSql()`UPDATE messages SET read = true WHERE id = ${id}`;
  revalidatePath('/admin/messages');
}
