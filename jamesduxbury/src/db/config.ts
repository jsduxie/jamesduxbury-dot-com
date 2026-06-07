import { neonConfig } from '@neondatabase/serverless';

// routes driver HTTP through the compose proxy when running against local Postgres
export function applyNeonProxy(): void {
  if (process.env.NEON_HTTP_PROXY) {
    neonConfig.fetchEndpoint = process.env.NEON_HTTP_PROXY;
  }
}
