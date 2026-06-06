import type { Metadata } from 'next';
import { PageShell } from '@/components/PageShell';
import { AboutDetail } from '@/components/about/AboutDetail';

export const metadata: Metadata = {
  title: 'About · James Duxbury',
  description:
    'About James Duxbury — final-year MEng Computer Science student at Durham, specialising in AI and application security.',
};

export const revalidate = 60;

export default function AboutPage() {
  return (
    <PageShell widthClass="max-w-4xl">
      <AboutDetail />
    </PageShell>
  );
}
