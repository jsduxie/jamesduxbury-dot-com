import Link from 'next/link';

export function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-border bg-bg/60 px-4 py-10 font-mono text-xs text-muted sm:px-6"
    >
      <div className="mx-auto max-w-7xl space-y-6">
        {/* contact line */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 uppercase tracking-[0.15em]">
          <span className="text-text">{`>`} contact</span>
          <Link
            href="mailto:jduxbury848@gmail.com"
            className="text-text/85 transition-colors hover:text-accent"
          >
            email ↗
          </Link>
          <Link href="/contact" className="text-text/85 transition-colors hover:text-accent">
            contact form ↗
          </Link>
          <Link
            href="https://github.com/jsduxie"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent"
          >
            github ↗
          </Link>
          <Link
            href="https://linkedin.com/in/jamesduxbury03"
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
            {`>`} jamesduxbury.com · v2.0 · last build {new Date().getFullYear()}
          </span>
          <span>
            {`> built with`} <span className="text-accent">next.js</span> · vercel
          </span>
        </div>
      </div>
    </footer>
  );
}
