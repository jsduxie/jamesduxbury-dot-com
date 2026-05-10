import type { Metadata } from 'next';
import Link from 'next/link';
import { AboutDetail } from '@/components/about/AboutDetail';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'About · James Duxbury',
  description:
    'About James Duxbury — final-year MEng Computer Science student at Durham, specialising in AI and application security.',
};

export default function AboutPage() {
  return (
    <>
      <main className="mx-auto max-w-4xl px-4 pb-10 pt-28 sm:px-6 sm:pt-32">
        <Link
          href="/"
          className="mb-8 inline-block font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
        >
          ← / home
        </Link>
        <AboutDetail />
      </main>
      <Footer />
    </>
  );
}
