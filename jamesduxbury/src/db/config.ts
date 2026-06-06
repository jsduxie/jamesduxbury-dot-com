import { neonConfig } from '@neondatabase/serverless';

// routes driver HTTP through the compose proxy when running against local Postgres
if (process.env.NEON_HTTP_PROXY) {
  neonConfig.fetchEndpoint = process.env.NEON_HTTP_PROXY;
}
