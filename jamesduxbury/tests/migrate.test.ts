import { execSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import { statements } from '../src/db/migrate';

describe('statements', () => {
  it('splits on semicolons and trims whitespace', () => {
    expect(statements('CREATE TABLE a (id int);\nCREATE TABLE b (id int);')).toEqual([
      'CREATE TABLE a (id int)',
      'CREATE TABLE b (id int)',
    ]);
  });

  it('ignores semicolons inside line comments', () => {
    const sql = '-- has; a semicolon\nCREATE TABLE a (id int); -- and; another\n';
    expect(statements(sql)).toEqual(['CREATE TABLE a (id int)']);
  });

  it('drops empty fragments', () => {
    expect(statements(';;\n  ;\n')).toEqual([]);
  });
});

describe('db:migrate', () => {
  it('is a no-op when all migrations are applied', () => {
    const out = execSync('npm run db:migrate', { encoding: 'utf8' });
    expect(out).toContain('no pending migrations.');
  });
});
