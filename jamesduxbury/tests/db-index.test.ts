import { afterEach, describe, expect, it } from 'vitest';
import { getSql } from '../src/db';
import { main } from '../src/db/migrate';

const saved = process.env.DATABASE_URL;

afterEach(() => {
  process.env.DATABASE_URL = saved;
});

describe('getSql', () => {
  it('throws without DATABASE_URL', () => {
    delete process.env.DATABASE_URL;
    expect(() => getSql()).toThrow('DATABASE_URL is not set');
  });

  it('returns a queryable client', async () => {
    const sql = getSql();
    const [row] = await sql`SELECT 1 AS one`;
    expect(row.one).toBe(1);
  });
});

describe('migrate main', () => {
  it('migrate mode is a no-op when up to date', async () => {
    await expect(main('migrate')).resolves.toBeUndefined();
  });

  it('push mode reapplies the idempotent schema safely', async () => {
    await expect(main('push')).resolves.toBeUndefined();
  });
});
