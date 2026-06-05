import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe('site config', () => {
  it('strips trailing slashes from NEXT_PUBLIC_SITE_URL', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.com///');
    const { SITE_URL, SITE_HOST } = await import('../src/lib/site');
    expect(SITE_URL).toBe('https://example.com');
    expect(SITE_HOST).toBe('example.com');
  });

  it('falls back to the vercel domain', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    const { SITE_URL } = await import('../src/lib/site');
    expect(SITE_URL).toBe('https://jamesduxbury-dot-com.vercel.app');
  });
});

describe('sitemap and robots', () => {
  it('covers every public route with no double slashes', async () => {
    const { default: sitemap } = await import('../src/app/sitemap');
    const { SITE_ROUTES } = await import('../src/lib/site');
    const entries = sitemap();
    expect(entries).toHaveLength(SITE_ROUTES.length);
    for (const e of entries) {
      expect(e.url).not.toMatch(/[^:]\/\//);
    }
  });

  it('disallows /api/ and /admin/ and links the sitemap', async () => {
    const { default: robots } = await import('../src/app/robots');
    const r = robots();
    expect(r.rules).toMatchObject({ disallow: ['/api/', '/admin/'] });
    expect(r.sitemap).toMatch(/\/sitemap\.xml$/);
  });
});
