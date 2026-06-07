import { neon } from '@neondatabase/serverless';
import { applyNeonProxy } from '../src/db/config';
import { loadEnvLocal } from '../src/db/env';
import { seed } from '../src/db/seed';

loadEnvLocal();
applyNeonProxy();
const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is not set (env or .env.local).');
  process.exit(1);
}
seed(neon(url))
  .then((counts) => console.log('seeded:', counts))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
