import type { Metadata } from 'next';
import { PageShell } from '@/components/PageShell';
import { WorkDetail } from '@/components/work/WorkDetail';

export const metadata: Metadata = {
  title: 'Work · James Duxbury',
  description:
    'Projects by James Duxbury — FG-HAN dissertation, JSGrades, Researcher Agent, X-Ray Image Repair, Artemis III.',
};

export const revalidate = 60;

export default function WorkPage() {
  return (
    <PageShell widthClass="max-w-7xl">
      <WorkDetail />
    </PageShell>
  );
}
