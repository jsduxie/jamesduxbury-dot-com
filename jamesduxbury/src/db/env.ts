import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

export function loadEnvLocal(): void {
  const envPath = join(appRoot, '.env.local');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (match && process.env[match[1]] === undefined) {
      // Quotes stripped to match Next.js/dotenv behaviour
      process.env[match[1]] = match[2].trim().replace(/^(["'])(.*)\1$/, '$2');
    }
  }
}
