import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { loadEnvLocal } from '../src/db/env';

const dir = mkdtempSync(join(tmpdir(), 'env-test-'));
const file = join(dir, '.env.local');

afterEach(() => {
  delete process.env.ENV_TEST_PLAIN;
  delete process.env.ENV_TEST_QUOTED;
  delete process.env.ENV_TEST_SINGLE;
  delete process.env.ENV_TEST_EXISTING;
});

describe('loadEnvLocal', () => {
  it('loads plain and quote-wrapped values', () => {
    writeFileSync(
      file,
      'ENV_TEST_PLAIN=abc\nENV_TEST_QUOTED="postgresql://u:p@host/db?x=1"\nENV_TEST_SINGLE=\'single\'\n',
    );
    loadEnvLocal(file);
    expect(process.env.ENV_TEST_PLAIN).toBe('abc');
    expect(process.env.ENV_TEST_QUOTED).toBe('postgresql://u:p@host/db?x=1');
    expect(process.env.ENV_TEST_SINGLE).toBe('single');
  });

  it('does not override variables already set in the environment', () => {
    process.env.ENV_TEST_EXISTING = 'real';
    writeFileSync(file, 'ENV_TEST_EXISTING=fromfile\n');
    loadEnvLocal(file);
    expect(process.env.ENV_TEST_EXISTING).toBe('real');
  });

  it('ignores comments, blanks and malformed lines', () => {
    writeFileSync(file, '# comment\n\nnot a pair\nENV_TEST_PLAIN=ok\n');
    loadEnvLocal(file);
    expect(process.env.ENV_TEST_PLAIN).toBe('ok');
  });

  it('is a no-op for a missing file', () => {
    rmSync(file);
    expect(() => loadEnvLocal(file)).not.toThrow();
  });
});
