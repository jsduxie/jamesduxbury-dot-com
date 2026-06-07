import Link from 'next/link';
import type { SiteSettings } from '@/data/site';
import { getSiteSettings } from '@/db/queries';

// sync view so loading skeletons can render the chrome without a DB read
export function FooterContent({ settings }: { settings: SiteSettings }) {
  return (
    <footer
      id="contact"
      className="mt-16 border-t border-border bg-bg/60 px-4 py-10 font-mono text-xs text-muted sm:px-6"
    >
      <div className="mx-auto max-w-7xl space-y-6">
        {/* contact line */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 uppercase tracking-[0.15em]">
          <span className="text-text">{`>`} contact</span>
          <Link
            href={`mailto:${settings.contactEmail}`}
            className="text-text/85 transition-colors hover:text-accent"
          >
            email ↗
          </Link>
          <Link href="/contact" className="text-text/85 transition-colors hover:text-accent">
            contact form ↗
          </Link>
          <Link
            href={settings.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent"
          >
            github ↗
          </Link>
          <Link
            href={settings.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent"
          >
            linkedin ↗
          </Link>
        </div>

        {/* footer bottom */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-[0.65rem] uppercase tracking-[0.18em]">
          <span>
            {`>`} jamesduxbury.com · {settings.siteVersion} · last build {new Date().getFullYear()}
          </span>
          <span>
            {`> built with`} <span className="text-accent">next.js</span> · vercel
          </span>
        </div>
      </div>
    </footer>
  );
}

export async function Footer() {
  return <FooterContent settings={await getSiteSettings()} />;
}
