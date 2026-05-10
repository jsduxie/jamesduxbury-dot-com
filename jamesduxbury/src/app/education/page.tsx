import type { Metadata } from 'next';
import Link from 'next/link';
import { EducationDetail } from '@/components/education/EducationDetail';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Education · James Duxbury',
  description:
    'Education and certifications of James Duxbury — MEng Computer Science at Durham, AfCIIS, ITIL 4 Foundation, Azure AI Fundamentals.',
};

export default function EducationPage() {
  return (
    <>
      <main className="mx-auto max-w-5xl px-4 pb-10 pt-28 sm:px-6 sm:pt-32">
        <Link
          href="/"
          className="mb-8 inline-block font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
        >
          ← / home
        </Link>
        <EducationDetail />
      </main>
      <Footer />
    </>
  );
}
