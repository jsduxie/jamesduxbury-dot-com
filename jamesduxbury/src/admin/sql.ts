import { getSql } from '@/db';

export interface AdminRow extends Record<string, unknown> {
  id: number;
}

// table and column names come from the static section registry, not user input

export async function listRows(table: string): Promise<AdminRow[]> {
  return (await getSql().query(`SELECT * FROM ${table} ORDER BY sort_order, id`)) as AdminRow[];
}

export async function getRow(table: string, id: number): Promise<AdminRow | null> {
  const rows = (await getSql().query(`SELECT * FROM ${table} WHERE id = $1`, [id])) as AdminRow[];
  return rows[0] ?? null;
}

export async function countRows(table: string): Promise<number> {
  const rows = (await getSql().query(`SELECT count(*)::int AS count FROM ${table}`)) as {
    count: number;
  }[];
  return rows[0].count;
}

export async function insertRow(table: string, values: Record<string, unknown>): Promise<void> {
  const cols = Object.keys(values);
  const params = cols.map((_, i) => `$${i + 1}`);
  await getSql().query(
    `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${params.join(', ')})`,
    cols.map((c) => values[c]),
  );
}

export async function updateRow(
  table: string,
  id: number,
  values: Record<string, unknown>,
): Promise<void> {
  const cols = Object.keys(values);
  const sets = cols.map((c, i) => `${c} = $${i + 1}`);
  await getSql().query(
    `UPDATE ${table} SET ${sets.join(', ')}, updated_at = now() WHERE id = $${cols.length + 1}`,
    [...cols.map((c) => values[c]), id],
  );
}

export async function deleteRow(table: string, id: number): Promise<void> {
  await getSql().query(`DELETE FROM ${table} WHERE id = $1`, [id]);
}

// shifts rows at or below sortOrder down one place
export async function makeRoomAt(
  table: string,
  sortOrder: number,
  excludeId: number | null,
): Promise<void> {
  const sql = getSql();
  const clash = (await sql.query(
    `SELECT 1 FROM ${table} WHERE sort_order = $1 AND ($2::int IS NULL OR id <> $2) LIMIT 1`,
    [sortOrder, excludeId],
  )) as unknown[];
  if (clash.length === 0) return;
  const rows = (await sql.query(
    `SELECT id FROM ${table} WHERE sort_order >= $1 AND ($2::int IS NULL OR id <> $2)
     ORDER BY sort_order DESC, id DESC`,
    [sortOrder, excludeId],
  )) as { id: number }[];
  // updates highest sort_order first to avoid unique collisions
  for (const row of rows) {
    await sql.query(`UPDATE ${table} SET sort_order = sort_order + 1 WHERE id = $1`, [row.id]);
  }
}
