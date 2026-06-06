import type { Metadata } from 'next';
import { PageShell } from '@/components/PageShell';
import { SkillsDetail } from '@/components/skills/SkillsDetail';

export const metadata: Metadata = {
  title: 'Skills · James Duxbury',
  description:
    'Technical skills of James Duxbury — languages, AI/ML, cloud, infrastructure, and development practices.',
};

export const revalidate = 60;

export default function SkillsPage() {
  return (
    <PageShell widthClass="max-w-5xl">
      <SkillsDetail />
    </PageShell>
  );
}
