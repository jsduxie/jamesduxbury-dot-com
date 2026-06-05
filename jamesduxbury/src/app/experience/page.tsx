import type { Metadata } from 'next';
import Link from 'next/link';
import { ExperienceDetail } from '@/components/experience/ExperienceDetail';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Experience · James Duxbury',
  description:
    'Professional experience of James Duxbury — Compare the Market, DataAnnotation, Snap-on Tools, Next.',
};

export const revalidate = 60;

export default function ExperiencePage() {
  return (
    <>
      <main className="mx-auto max-w-5xl px-4 pb-10 pt-28 sm:px-6 sm:pt-32">
        <Link
          href="/"
          className="mb-8 inline-block font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
        >
          ← / home
        </Link>
        <ExperienceDetail />
      </main>
      <Footer />
    </>
  );
}
