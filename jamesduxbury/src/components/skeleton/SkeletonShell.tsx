import Link from 'next/link';
import { SectionHeader } from '@/components/console/SectionHeader';
import { Footer } from '@/components/Footer';

interface SkeletonShellProps {
  channel: string;
  label: string;
  ariaLabel: string;
  widthClass: string;
  children: React.ReactNode;
}

export function SkeletonShell({
  channel,
  label,
  ariaLabel,
  widthClass,
  children,
}: SkeletonShellProps) {
  return (
    <>
      <main
        aria-busy="true"
        aria-label={ariaLabel}
        className={`mx-auto ${widthClass} px-4 pb-10 pt-28 sm:px-6 sm:pt-32`}
      >
        <Link
          href="/"
          className="mb-8 inline-block font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
        >
          ← / home
        </Link>
        <section>
          <SectionHeader channel={channel} label={label} />
          <div className="border border-border bg-surface/40 backdrop-blur-sm">{children}</div>
        </section>
      </main>
      <Footer />
    </>
  );
}
