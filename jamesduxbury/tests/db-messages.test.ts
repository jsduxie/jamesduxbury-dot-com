import { neon } from '@neondatabase/serverless';
import { afterAll, describe, expect, it } from 'vitest';
import { getMessages, insertMessage, markRead } from '../src/db/messages';

const sql = neon(process.env.DATABASE_URL!);
const emailMarker = 'db-messages-test@example.com';

afterAll(async () => {
  await sql`DELETE FROM messages WHERE email = ${emailMarker}`;
});

describe('messages module', () => {
  it('round-trips a message through insert, list and markRead', async () => {
    const blocks = [{ kind: 'p' as const, runs: ['hello from db-messages test'] }];
    await insertMessage('Test', emailMarker, blocks);

    const inserted = (await getMessages()).find((m) => m.email === emailMarker);
    expect(inserted).toBeDefined();
    expect(inserted!.name).toBe('Test');
    expect(inserted!.message).toEqual(blocks);
    expect(inserted!.read).toBe(false);
    expect(inserted!.receivedAt).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);

    await markRead(inserted!.id);
    const after = (await getMessages()).find((m) => m.id === inserted!.id);
    expect(after!.read).toBe(true);
  });
});
