import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { neon } from '@neondatabase/serverless';
import { loadEnvLocal } from './env';

const here = dirname(fileURLToPath(import.meta.url));

// Comments stripped first so their semicolons don't split; fine while the DDL has no function bodies.
export function statements(sqlText: string): string[] {
  return sqlText
    .split('\n')
    .map((line) => line.replace(/--.*$/, ''))
    .join('\n')
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function migrationFiles(): string[] {
  return readdirSync(join(here, 'migrations'))
    .filter((f) => f.endsWith('.sql'))
    .sort();
}

export async function main(mode: 'migrate' | 'push' = 'migrate'): Promise<void> {
  loadEnvLocal();
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL is not set (env or .env.local).');
    process.exit(1);
  }
  const sql = neon(url);

  await sql.query(`CREATE TABLE IF NOT EXISTS _migrations (
    name text PRIMARY KEY,
    applied_at timestamptz NOT NULL DEFAULT now()
  )`);

  if (mode === 'push') {
    const schema = readFileSync(join(here, 'schema.sql'), 'utf8');
    for (const stmt of statements(schema)) {
      await sql.query(stmt);
    }
    for (const file of migrationFiles()) {
      await sql.query('INSERT INTO _migrations (name) VALUES ($1) ON CONFLICT DO NOTHING', [file]);
    }
    console.log('schema.sql applied; migrations marked as applied.');
    return;
  }

  const appliedRows = (await sql.query('SELECT name FROM _migrations')) as { name: string }[];
  const applied = new Set(appliedRows.map((r) => r.name));

  let ran = 0;
  for (const file of migrationFiles()) {
    if (applied.has(file)) continue;
    const text = readFileSync(join(here, 'migrations', file), 'utf8');
    for (const stmt of statements(text)) {
      await sql.query(stmt);
    }
    await sql.query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
    console.log(`applied ${file}`);
    ran += 1;
  }
  console.log(ran === 0 ? 'no pending migrations.' : `${ran} migration(s) applied.`);
}

if (process.argv[1]?.endsWith('migrate.ts')) {
  main(process.argv[2] === '--push' ? 'push' : 'migrate').catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
