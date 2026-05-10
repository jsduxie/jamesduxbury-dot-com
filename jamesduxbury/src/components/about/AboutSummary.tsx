import Link from 'next/link';
import { Widget } from '@/components/console/Widget';
import { aboutParagraphs } from '@/data/about';

const SUMMARY_COUNT = 2;

export const AboutSummary: React.FC = () => (
  <Widget channel="01" label="TRANSMISSION" id="about">
    <div className="space-y-4 px-4 py-5 text-sm leading-relaxed text-text/85 sm:px-6 sm:text-base">
      {aboutParagraphs.slice(0, SUMMARY_COUNT).map((p, i) => (
        <p key={i} dangerouslySetInnerHTML={{ __html: p.html }} />
      ))}
    </div>
    <Link
      href="/about"
      className="group flex items-center justify-between border-t border-border bg-bg/40 px-4 py-3 font-mono text-sm uppercase tracking-[0.18em] text-accent transition-colors hover:bg-accent/10 sm:px-6"
    >
      <span>+ {aboutParagraphs.length - SUMMARY_COUNT} more paragraphs</span>
      <span className="transition-transform group-hover:translate-x-1">open /about →</span>
    </Link>
  </Widget>
);
