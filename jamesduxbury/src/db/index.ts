import { neon } from '@neondatabase/serverless';
import { applyNeonProxy } from './config';

// Tagged-template queries only; the driver parameterises every interpolated value
export function getSql() {
  applyNeonProxy();
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not set');
  }
  return neon(url);
}

export type Sql = ReturnType<typeof getSql>;
