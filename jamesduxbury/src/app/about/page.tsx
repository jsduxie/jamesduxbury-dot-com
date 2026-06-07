import type { Metadata } from 'next';
import { PageShell } from '@/components/PageShell';
import { AboutDetail } from '@/components/about/AboutDetail';
import { getSiteSettings } from '@/db/queries';

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  return { title: `About · ${s.ownerName}`, description: s.metaDescription };
}

export const revalidate = 60;

export default function AboutPage() {
  return (
    <PageShell widthClass="max-w-4xl">
      <AboutDetail />
    </PageShell>
  );
}
