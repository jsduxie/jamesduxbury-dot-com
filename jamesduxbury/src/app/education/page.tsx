import type { Metadata } from 'next';
import { PageShell } from '@/components/PageShell';
import { EducationDetail } from '@/components/education/EducationDetail';

export const metadata: Metadata = {
  title: 'Education · James Duxbury',
  description:
    'Education and certifications of James Duxbury — MEng Computer Science at Durham, AfCIIS, ITIL 4 Foundation, Azure AI Fundamentals.',
};

export const revalidate = 60;

export default function EducationPage() {
  return (
    <PageShell widthClass="max-w-5xl">
      <EducationDetail />
    </PageShell>
  );
}
