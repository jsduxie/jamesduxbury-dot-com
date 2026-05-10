import Link from 'next/link';

interface Channel {
  label: string;
  display: string;
  cta: string;
  href: string;
  external?: boolean;
}

const channels: Channel[] = [
  {
    label: 'Email',
    display: 'secure mailto channel',
    cta: 'compose',
    href: 'mailto:jduxbury848@gmail.com',
  },
  {
    label: 'GitHub',
    display: '@jsduxie',
    cta: 'open',
    href: 'https://github.com/jsduxie',
    external: true,
  },
  {
    label: 'LinkedIn',
    display: 'in/jamesduxbury03',
    cta: 'open',
    href: 'https://linkedin.com/in/jamesduxbury03',
    external: true,
  },
];

export const ContactChannels: React.FC = () => (
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
