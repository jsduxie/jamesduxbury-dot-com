import type { Metadata } from 'next';
import { PageShell } from '@/components/PageShell';
import { WorkDetail } from '@/components/work/WorkDetail';
import { getProjects, getSiteSettings } from '@/db/queries';

// derived from the same rows the page renders, so it can never go stale
export async function generateMetadata(): Promise<Metadata> {
  const [s, projects] = await Promise.all([getSiteSettings(), getProjects()]);
  return {
    title: `Work · ${s.ownerName}`,
    description: `Projects by ${s.ownerName} — ${projects.map((p) => p.title).join(', ')}.`,
  };
}

export const revalidate = 60;

export default function WorkPage() {
  return (
    <PageShell widthClass="max-w-7xl">
      <WorkDetail />
    </PageShell>
  );
}
