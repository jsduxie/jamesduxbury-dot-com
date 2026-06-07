import { getSql } from '@/db';

const MAX_DURATION_MS = 6 * 60 * 60 * 1000;

export async function insertView(
  sessionId: string,
  path: string,
  referrer: string | null,
  country: string | null,
): Promise<string> {
  const [row] = (await getSql()`
    INSERT INTO page_views (session_id, path, referrer, country)
    VALUES (${sessionId}, ${path}, ${referrer}, ${country})
    RETURNING id
  `) as { id: string | number }[];
  return String(row.id);
}

// duration is written once by the exit beacon; later beacons must not extend it
export async function setViewDuration(id: string, durationMs: number): Promise<void> {
  await getSql()`
    UPDATE page_views SET duration_ms = ${Math.min(durationMs, MAX_DURATION_MS)}
    WHERE id = ${id}::bigint AND duration_ms IS NULL
  `;
}
