import Link from 'next/link';
import { Footer } from '@/components/Footer';

interface PageShellProps {
  widthClass: string;
  loadingLabel?: string;
  children: React.ReactNode;
}

// page chrome shared by the six section pages and their loading skeletons
export function PageShell({ widthClass, loadingLabel, children }: PageShellProps) {
  return (
    <>
      <main
        aria-busy={loadingLabel ? true : undefined}
        aria-label={loadingLabel}
        className={`mx-auto ${widthClass} px-4 pb-10 pt-28 sm:px-6 sm:pt-32`}
      >
        <Link
          href="/"
          className="mb-8 inline-block font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
        >
          ← / home
        </Link>
        {children}
      </main>
      <Footer />
    </>
  );
}
