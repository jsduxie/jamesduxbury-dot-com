/** Canonical site origin, overridable per environment. Trailing slashes are stripped. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://jamesduxbury-dot-com.vercel.app'
).replace(/\/+$/, '');

/** Bare hostname of the canonical origin, for display (e.g. the OG card footer). */
export const SITE_HOST = new URL(SITE_URL).hostname;

/** Public routes, used by the sitemap. */
export const SITE_ROUTES = [
  '/',
  '/about',
  '/work',
  '/skills',
  '/experience',
  '/education',
  '/architecture',
  '/contact',
] as const;
