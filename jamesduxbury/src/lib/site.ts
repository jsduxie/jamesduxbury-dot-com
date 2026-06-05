/** Canonical site origin, overridable per environment. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jamesduxbury-dot-com.vercel.app';

/** Public routes, used by the sitemap. */
export const SITE_ROUTES = [
  '/',
  '/about',
  '/work',
  '/skills',
  '/experience',
  '/education',
  '/contact',
] as const;
