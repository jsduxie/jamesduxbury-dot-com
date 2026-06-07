import Link from 'next/link';
import { getSiteSettings } from '@/db/queries';

interface Channel {
  label: string;
  display: string;
  cta: string;
  href: string;
  external?: boolean;
}

export async function ContactChannels() {
  const settings = await getSiteSettings();
  const channels: Channel[] = [
    {
      label: 'Email',
      display: 'secure mailto channel',
      cta: 'compose',
      href: `mailto:${settings.contactEmail}`,
    },
    {
      label: 'GitHub',
      display: `@${new URL(settings.githubUrl).pathname.replace(/^\//, '')}`,
      cta: 'open',
      href: settings.githubUrl,
      external: true,
    },
    {
      label: 'LinkedIn',
      display: new URL(settings.linkedinUrl).pathname.replace(/^\//, ''),
      cta: 'open',
      href: settings.linkedinUrl,
      external: true,
    },
  ];
  return (
    <div className="divide-y divide-border border-y border-border">
      {channels.map((c) => (
        <div
          key={c.label}
          className="grid grid-cols-1 gap-1 px-4 py-3.5 sm:grid-cols-[8rem_1fr_auto] sm:items-baseline sm:gap-6 sm:px-6 sm:py-4"
        >
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted sm:text-xs">
            {c.label}
          </span>
          <span className="font-mono text-sm text-muted">{c.display}</span>
          <Link
            href={c.href}
            {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-accent transition-colors hover:text-danger sm:justify-self-end"
          >
            {c.cta}
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              ↗
            </span>
          </Link>
        </div>
      ))}
    </div>
  );
}
