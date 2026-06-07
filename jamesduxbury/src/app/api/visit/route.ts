import { insertView, setViewDuration } from '@/db/visits';
import { auth, isAdminSession } from '@/auth';

const BOT_UA = /bot|crawl|spider|slurp|headless|preview|monitor|lighthouse/i;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
  // skips the signed-in admin's visits
  if (await isAdminSession(await auth())) {
    return new Response(null, { status: 204 });
  }

  let body: VisitPayload;
  try {
    body = (await req.json()) as VisitPayload;
  } catch {
    return Response.json({ error: 'Invalid payload' }, { status: 400 });
  }

  // Exit beacon: records how long the view lasted
  if (body.id !== undefined) {
    // bigserial ids travel as strings to avoid a 32-bit assumption in the contract
    const id = typeof body.id === 'string' && /^\d{1,18}$/.test(body.id) ? body.id : null;
    const durationMs = typeof body.durationMs === 'number' ? Math.round(body.durationMs) : NaN;
    if (id === null || !Number.isFinite(durationMs) || durationMs < 0) {
      return Response.json({ error: 'Invalid payload' }, { status: 400 });
    }
    await setViewDuration(id, durationMs);
    return new Response(null, { status: 204 });
  }

  const sessionId = typeof body.sessionId === 'string' ? body.sessionId : '';
  const path = typeof body.path === 'string' ? body.path : '';
  const referrer =
    typeof body.referrer === 'string' && body.referrer ? body.referrer.slice(0, 500) : null;
  if (!UUID.test(sessionId) || !path.startsWith('/') || path.length > 200) {
    return Response.json({ error: 'Invalid payload' }, { status: 400 });
  }

  // Public endpoint: the geo header is caller-controlled, so clamp it
  const countryHeader = req.headers.get('x-vercel-ip-country');
  const country = countryHeader && /^[A-Z]{2}$/.test(countryHeader) ? countryHeader : null;
  const id = await insertView(sessionId, path, referrer, country);
  return Response.json({ id });
}
