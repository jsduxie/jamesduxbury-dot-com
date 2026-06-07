import type { Metadata } from 'next';
import { PageShell } from '@/components/PageShell';
import { ArchitectureDetail } from '@/components/architecture/ArchitectureDetail';
import { getArchitectureSections, getSiteSettings } from '@/db/queries';
import { runText } from '@/data/about';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const [s, sections] = await Promise.all([getSiteSettings(), getArchitectureSections()]);
  const stack = sections.find((x) => x.kind === 'stack');
  return {
    title: `Architecture · ${s.ownerName}`,
    description: stack
      ? `How this site is built: ${stack.body.map(runText).join(' ')}.`
      : `How this site is built · ${s.ownerName}.`,
  };
}

export default function ArchitecturePage() {
  return (
    <PageShell widthClass="max-w-5xl">
      <ArchitectureDetail />
    </PageShell>
  );
}
