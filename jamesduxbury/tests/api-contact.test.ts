import { neon } from '@neondatabase/serverless';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

const sendMail = vi.fn();
vi.mock('nodemailer', () => ({
  default: { createTransport: () => ({ sendMail }) },
}));

// Lets individual tests simulate the messages insert failing
const dbDown = { value: false };
vi.mock('@/db', async (importOriginal) => {
  const mod = await importOriginal<typeof import('../src/db')>();
  return {
    getSql: () => {
      if (dbDown.value) throw new Error('db down');
      return mod.getSql();
    },
  };
});

import { POST } from '../src/app/api/contact/route';

const sql = neon(process.env.DATABASE_URL!);
const marker = `vitest-${Date.now()}@example.com`;

function request(body: unknown): Request {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  sendMail.mockReset().mockResolvedValue(undefined);
  dbDown.value = false;
});

afterAll(async () => {
  await sql`DELETE FROM messages WHERE email = ${marker}`;
});

describe('POST /api/contact', () => {
  it('stores the message and sends the email', async () => {
    const res = await POST(request({ name: 'Vitest', email: marker, message: 'hello there' }));
    expect(res.status).toBe(200);
    expect(sendMail).toHaveBeenCalledTimes(1);

    const rows = await sql`SELECT name, message, read FROM messages WHERE email = ${marker}`;
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      name: 'Vitest',
      message: [{ kind: 'p', runs: ['hello there'] }],
      read: false,
    });
  });

  it('parses markup into blocks and keeps a safe link', async () => {
    const res = await POST(
      request({ name: 'Vitest', email: marker, message: 'see **this** [doc](https://x.dev)' }),
    );
    expect(res.status).toBe(200);
    const rows = await sql`
      SELECT message FROM messages WHERE email = ${marker} AND message::text LIKE '%https://x.dev%'
    `;
    expect(rows[0].message).toEqual([
      {
        kind: 'p',
        runs: ['see ', { strong: 'this' }, ' ', { link: { text: 'doc', href: 'https://x.dev' } }],
      },
    ]);
  });

  it('stores a list and renders it for the email channel', async () => {
    const res = await POST(
      request({ name: 'Vitest', email: marker, message: '- one\n- two\n\nplain *text*' }),
    );
    expect(res.status).toBe(200);
    expect(sendMail).toHaveBeenCalledTimes(1);
    const rows = await sql`
      SELECT message FROM messages WHERE email = ${marker} AND message::text LIKE '%"list"%'
    `;
    expect(rows[0].message).toEqual([
      { kind: 'list', items: [['one'], ['two']] },
      { kind: 'p', runs: ['plain ', { em: 'text' }] },
    ]);
  });

  it('rejects a whitespace-only message', async () => {
    const res = await POST(request({ name: 'Vitest', email: marker, message: '   \n\n  ' }));
    expect(res.status).toBe(400);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('succeeds without email when the message is stored', async () => {
    sendMail.mockRejectedValueOnce(new Error('smtp down'));
    const res = await POST(request({ name: 'Vitest', email: marker, message: 'survives smtp' }));
    expect(res.status).toBe(200);

    const rows = await sql`
      SELECT 1 FROM messages WHERE email = ${marker} AND message::text LIKE '%survives smtp%'
    `;
    expect(rows).toHaveLength(1);
  });

  it('succeeds without storage when the email is sent', async () => {
    dbDown.value = true;
    const res = await POST(request({ name: 'Vitest', email: marker, message: 'email only' }));
    expect(res.status).toBe(200);
    expect(sendMail).toHaveBeenCalledTimes(1);
    dbDown.value = false;

    const rows = await sql`
      SELECT 1 FROM messages WHERE email = ${marker} AND message::text LIKE '%email only%'
    `;
    expect(rows).toHaveLength(0);
  });

  it('fails only when both channels fail', async () => {
    dbDown.value = true;
    sendMail.mockRejectedValueOnce(new Error('smtp down'));
    const res = await POST(request({ name: 'Vitest', email: marker, message: 'all down' }));
    expect(res.status).toBe(500);
  });

  it.each([
    [{}],
    [{ name: 'a', email: marker }],
    [{ name: '', email: marker, message: 'x' }],
    [{ name: 'a', email: 'not-an-email', message: 'x' }],
    [{ name: 'a'.repeat(201), email: marker, message: 'x' }],
    [{ name: 'a', email: marker, message: 'x'.repeat(5001) }],
  ])('rejects invalid payload and stores nothing', async (body) => {
    const before = await sql`SELECT count(*) AS n FROM messages`;
    expect((await POST(request(body))).status).toBe(400);
    expect(sendMail).not.toHaveBeenCalled();
    const after = await sql`SELECT count(*) AS n FROM messages`;
    expect(after[0].n).toBe(before[0].n);
  });

  it('rejects malformed JSON', async () => {
    const res = await POST(new Request('http://localhost/api/contact', { method: 'POST', body: '{' }));
    expect(res.status).toBe(400);
  });
});
