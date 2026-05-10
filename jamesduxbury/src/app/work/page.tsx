import type { Metadata } from 'next';
import Link from 'next/link';
import { WorkDetail } from '@/components/work/WorkDetail';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Work · James Duxbury',
  description:
    'Projects by James Duxbury — FG-HAN dissertation, JSGrades, Researcher Agent, X-Ray Image Repair, Artemis III.',
};

export default function WorkPage() {
  return (
    <>
      <main className="mx-auto max-w-7xl px-4 pb-10 pt-28 sm:px-6 sm:pt-32">
        <Link
          href="/"
          className="mb-8 inline-block font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
        >
          ← / home
        </Link>
        <WorkDetail />
      </main>
      <Footer />
    </>
  );
}
