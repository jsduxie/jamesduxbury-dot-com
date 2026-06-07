import type { Metadata } from 'next';
import { PageShell } from '@/components/PageShell';
import { ExperienceDetail } from '@/components/experience/ExperienceDetail';
import { getRoles, getSiteSettings } from '@/db/queries';

export async function generateMetadata(): Promise<Metadata> {
  const [s, roles] = await Promise.all([getSiteSettings(), getRoles()]);
  const organisations = [...new Set(roles.map((r) => r.organisation))].join(', ');
  return {
    title: `Experience · ${s.ownerName}`,
    description: organisations
      ? `Professional experience of ${s.ownerName} — ${organisations}.`
      : `Professional experience of ${s.ownerName}.`,
  };
}

export const revalidate = 60;

export default function ExperiencePage() {
  return (
    <PageShell widthClass="max-w-5xl">
      <ExperienceDetail />
    </PageShell>
  );
}
