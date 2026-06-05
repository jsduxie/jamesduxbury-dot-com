import { getSql } from '@/db';

const BOT_UA = /bot|crawl|spider|slurp|headless|preview|monitor|lighthouse/i;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_DURATION_MS = 6 * 60 * 60 * 1000;

interface VisitPayload {
  sessionId?: unknown;
  path?: unknown;
  referrer?: unknown;
  id?: unknown;
  durationMs?: unknown;
}

export async function POST(req: Request) {
  if (BOT_UA.test(req.headers.get('user-agent') ?? '')) {
    return new Response(null, { status: 204 });
  }

  let body: VisitPayload;
  try {
    body = (await req.json()) as VisitPayload;
  } catch {
    return Response.json({ error: 'Invalid payload' }, { status: 400 });
  }

  // Exit beacon: records how long the view lasted
  if (typeof body.id === 'number') {
    const durationMs = typeof body.durationMs === 'number' ? Math.round(body.durationMs) : NaN;
    if (!Number.isInteger(body.id) || !Number.isFinite(durationMs) || durationMs < 0) {
      return Response.json({ error: 'Invalid payload' }, { status: 400 });
    }
    await getSql()`
      UPDATE page_views SET duration_ms = ${Math.min(durationMs, MAX_DURATION_MS)}
      WHERE id = ${body.id} AND duration_ms IS NULL
    `;
    return new Response(null, { status: 204 });
  }

  const sessionId = typeof body.sessionId === 'string' ? body.sessionId : '';
  const path = typeof body.path === 'string' ? body.path : '';
  const referrer =
    typeof body.referrer === 'string' && body.referrer ? body.referrer.slice(0, 500) : null;
  if (!UUID.test(sessionId) || !path.startsWith('/') || path.length > 200) {
    return Response.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const country = req.headers.get('x-vercel-ip-country');
  // bigint serialises as a string, so cast for the client round-trip
  const [row] = await getSql()`
    INSERT INTO page_views (session_id, path, referrer, country)
    VALUES (${sessionId}, ${path}, ${referrer}, ${country})
    RETURNING id::int
  `;
  return Response.json({ id: row.id });
}
