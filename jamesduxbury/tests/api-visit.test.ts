import { randomUUID } from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import { afterAll, describe, expect, it } from 'vitest';
import { POST } from '../src/app/api/visit/route';

const sql = neon(process.env.DATABASE_URL!);
const sessionId = randomUUID();

function request(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request('http://localhost/api/visit', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

afterAll(async () => {
  await sql`DELETE FROM page_views WHERE session_id = ${sessionId}`;
});

describe('POST /api/visit', () => {
  it('records a view and returns a numeric id', async () => {
    const res = await POST(
      request(
        { sessionId, path: '/work', referrer: 'https://example.com/' },
        { 'x-vercel-ip-country': 'GB' },
      ),
    );
    expect(res.status).toBe(200);
    const { id } = await res.json();
    expect(id).toMatch(/^\d+$/);

    const [row] = await sql`SELECT * FROM page_views WHERE id = ${id}::bigint`;
    expect(row.session_id).toBe(sessionId);
    expect(row.path).toBe('/work');
    expect(row.referrer).toBe('https://example.com/');
    expect(row.country).toBe('GB');
    expect(row.duration_ms).toBeNull();
  });

  it('discards a malformed country header', async () => {
    const res = await POST(
      request({ sessionId, path: '/contact' }, { 'x-vercel-ip-country': 'not-a-country-code' }),
    );
    const { id } = await res.json();
    const [row] = await sql`SELECT country FROM page_views WHERE id = ${id}::bigint`;
    expect(row.country).toBeNull();
  });

  it('records duration once and ignores later overwrites', async () => {
    const { id } = await (await POST(request({ sessionId, path: '/about' }))).json();

    expect((await POST(request({ id, durationMs: 1234 }))).status).toBe(204);
    expect((await POST(request({ id, durationMs: 9999 }))).status).toBe(204);

    const [row] = await sql`SELECT duration_ms FROM page_views WHERE id = ${id}::bigint`;
    expect(row.duration_ms).toBe(1234);
  });

  it('caps implausible durations', async () => {
    const { id } = await (await POST(request({ sessionId, path: '/skills' }))).json();
    await POST(request({ id, durationMs: 999_999_999_999 }));
    const [row] = await sql`SELECT duration_ms FROM page_views WHERE id = ${id}::bigint`;
    expect(row.duration_ms).toBe(6 * 60 * 60 * 1000);
  });

  it('skips bot user agents without writing', async () => {
    const before = await sql`SELECT count(*) AS n FROM page_views WHERE session_id = ${sessionId}`;
    const res = await POST(
      request({ sessionId, path: '/' }, { 'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' }),
    );
    expect(res.status).toBe(204);
    const after = await sql`SELECT count(*) AS n FROM page_views WHERE session_id = ${sessionId}`;
    expect(after[0].n).toBe(before[0].n);
  });

  it.each([
    [{ sessionId: 'not-a-uuid', path: '/' }],
    [{ sessionId: randomUUID(), path: 'no-leading-slash' }],
    [{ sessionId: randomUUID(), path: '/' + 'x'.repeat(300) }],
    [{ id: '1', durationMs: -5 }],
    [{ id: 1, durationMs: 5 }],
    [{ id: 'one', durationMs: 5 }],
  ])('rejects invalid payload %j', async (body) => {
    expect((await POST(request(body))).status).toBe(400);
  });

  it('rejects malformed JSON', async () => {
    const res = await POST(
      new Request('http://localhost/api/visit', { method: 'POST', body: 'not json' }),
    );
    expect(res.status).toBe(400);
  });
});
