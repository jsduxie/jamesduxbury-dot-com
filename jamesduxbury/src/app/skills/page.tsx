import type { Metadata } from 'next';
import { PageShell } from '@/components/PageShell';
import { SkillsDetail } from '@/components/skills/SkillsDetail';
import { getSiteSettings, getSkillGroups } from '@/db/queries';

export async function generateMetadata(): Promise<Metadata> {
  const [s, groups] = await Promise.all([getSiteSettings(), getSkillGroups()]);
  const headings = groups.map((g) => g.heading).join(', ');
  return {
    title: `Skills · ${s.ownerName}`,
    description: headings
      ? `Technical skills of ${s.ownerName} — ${headings}.`
      : `Technical skills of ${s.ownerName}.`,
  };
}

export const revalidate = 60;

export default function SkillsPage() {
  return (
    <PageShell widthClass="max-w-5xl">
      <SkillsDetail />
    </PageShell>
  );
}
