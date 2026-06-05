import type { Metadata } from 'next';
import Link from 'next/link';
import { SkillsDetail } from '@/components/skills/SkillsDetail';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Skills · James Duxbury',
  description:
    'Technical skills of James Duxbury — languages, AI/ML, cloud, infrastructure, and development practices.',
};

export const revalidate = 60;

export default function SkillsPage() {
  return (
    <>
      <main className="mx-auto max-w-5xl px-4 pb-10 pt-28 sm:px-6 sm:pt-32">
        <Link
          href="/"
          className="mb-8 inline-block font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
        >
          ← / home
        </Link>
        <SkillsDetail />
      </main>
      <Footer />
    </>
  );
}
