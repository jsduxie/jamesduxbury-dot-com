'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS: { href: string; label: string }[] = [
  { href: '/about', label: 'about' },
  { href: '/work', label: 'work' },
  { href: '/skills', label: 'skills' },
  { href: '/experience', label: 'experience' },
  { href: '/education', label: 'education' },
  { href: '/architecture', label: 'architecture' },
];

const isActive = (pathname: string | null, href: string): boolean => {
  if (!pathname) return false;
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
};

interface StatusBarProps {
  ownerName: string;
  siteVersion: string;
  cvHref: string;
  cvDownload: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  ownerName,
  siteVersion,
  cvHref,
  cvDownload,
}) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [session, setSession] = useState<string>('');

  useEffect(() => {
    const today = new Date();
    setSession(today.toISOString().slice(0, 10));

    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        {/* left — live indicator + identity (home link) */}
        <Link
          href="/"
          aria-label="Home"
          className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted sm:text-xs"
        >
          <span className="flex items-center gap-1.5 text-live">
            <span className="status-dot animate-pulse-dot bg-live" />
            LIVE
          </span>
          <span className="text-border">·</span>
          <span className="hidden text-text sm:inline">{ownerName.toUpperCase()}</span>
          <span className="hidden text-muted sm:inline">{siteVersion}</span>
          <span className="text-border sm:hidden">·</span>
          <span className="text-muted sm:hidden">{session}</span>
        </Link>

        {/* right — desktop nav */}
        <nav className="hidden items-center gap-6 font-mono text-sm uppercase tracking-[0.18em] lg:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`transition-colors ${
                  active ? 'text-accent' : 'text-text/75 hover:text-accent'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href={cvHref}
            download={cvDownload}
            className="text-text/75 transition-colors hover:text-accent"
          >
            cv.pdf
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-accent/60 bg-accent/10 px-3.5 py-1.5 text-accent transition-colors hover:border-accent hover:bg-accent hover:text-text"
          >
            contact
          </Link>
        </nav>

        {/* session timestamp on tablet */}
        <div className="hidden items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted sm:flex lg:hidden">
          <span>SESSION</span>
          <span className="text-text">{session}</span>
        </div>
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="font-mono text-sm uppercase tracking-[0.18em] text-muted hover:text-accent lg:hidden"
        >
          menu
        </button>
      </div>

      {/* mobile menu */}
      {isMenuOpen && (
        <nav className="border-t border-border bg-bg px-6 py-4 lg:hidden">
          <ul className="flex flex-col gap-3 font-mono text-sm uppercase tracking-[0.18em]">
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={active ? 'text-accent' : 'text-text/85 hover:text-accent'}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href={cvHref}
                download={cvDownload}
                onClick={() => setIsMenuOpen(false)}
                className="text-text/85 hover:text-accent"
              >
                cv.pdf
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="text-accent hover:text-danger"
              >
                contact
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};
