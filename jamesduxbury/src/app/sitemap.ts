import type { MetadataRoute } from 'next';
import { SITE_ROUTES, SITE_URL } from '@/lib/site';
import { getProjects } from '@/db/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  return [
    ...SITE_ROUTES.map((route) => ({
      url: `${SITE_URL}${route === '/' ? '' : route}`,
      changeFrequency: 'monthly' as const,
      priority: route === '/' ? 1 : 0.7,
    })),
    ...projects.map((p) => ({
      url: `${SITE_URL}/work/${p.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
