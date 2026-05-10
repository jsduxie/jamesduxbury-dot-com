import Link from 'next/link';

interface Contribution {
  date: string;
  contributionCount: number;
}

interface ContributionsResponse {
  total: { [year: string]: number };
  contributions: Contribution[];
}

async function fetchContributions(): Promise<Contribution[] | null> {
  try {
    const res = await fetch('https://github-contributions-api.deno.dev/jsduxie.json', {
      next: { revalidate: 60 * 60 * 6 }, // cache 6h
    });
    if (!res.ok) return null;
    const data: ContributionsResponse = await res.json();
    return data.contributions.slice(-91); // last ~13 weeks
  } catch {
    return null;
  }
}

function intensityClass(count: number): string {
  if (count === 0) return 'bg-border/60';
  if (count < 3) return 'bg-accent/30';
  if (count < 6) return 'bg-accent/55';
  if (count < 10) return 'bg-accent/80';
  return 'bg-accent';
}

export const Footer: React.FC = async () => {
  const contributions = await fetchContributions();

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

        {/* github activity */}
        {contributions && contributions.length > 0 && (
          <div>
            <p className="mb-2 uppercase tracking-[0.18em]">
              {`>`} github activity · last 13 weeks · @jsduxie
            </p>
            <div className="flex gap-[3px]" aria-hidden>
              {Array.from({ length: Math.ceil(contributions.length / 7) }, (_, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-[3px]">
                  {contributions.slice(weekIdx * 7, weekIdx * 7 + 7).map((c) => (
                    <span
                      key={c.date}
                      title={`${c.date}: ${c.contributionCount}`}
                      className={`h-2.5 w-2.5 rounded-[1px] ${intensityClass(c.contributionCount)}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* footer bottom */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-[0.65rem] uppercase tracking-[0.18em]">
          <span>
            {`>`} eng-console · v2.0 · last build {new Date().getFullYear()}
          </span>
          <span>
            {`> built with`} <span className="text-accent">next.js</span> · vercel
          </span>
        </div>
      </div>
    </footer>
  );
};
