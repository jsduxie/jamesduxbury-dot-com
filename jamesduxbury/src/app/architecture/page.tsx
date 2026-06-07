import type { Metadata } from 'next';
import { PageShell } from '@/components/PageShell';
import { ArchitectureDetail } from '@/components/architecture/ArchitectureDetail';

export const metadata: Metadata = {
  title: 'Architecture · James Duxbury',
  description:
    'How this site is built: Next.js 15, Neon Postgres with raw SQL, a schema-driven admin console, and first-party analytics.',
};

export default function ArchitecturePage() {
  return (
    <PageShell widthClass="max-w-5xl">
      <ArchitectureDetail />
    </PageShell>
  );
}
