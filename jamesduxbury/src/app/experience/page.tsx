import type { Metadata } from 'next';
import { PageShell } from '@/components/PageShell';
import { ExperienceDetail } from '@/components/experience/ExperienceDetail';

export const metadata: Metadata = {
  title: 'Experience · James Duxbury',
  description:
    'Professional experience of James Duxbury — Compare the Market, DataAnnotation, Snap-on Tools, Next.',
};

export const revalidate = 60;

export default function ExperiencePage() {
  return (
    <PageShell widthClass="max-w-5xl">
      <ExperienceDetail />
    </PageShell>
  );
}
