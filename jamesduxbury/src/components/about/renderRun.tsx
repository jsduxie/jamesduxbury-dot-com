import { Fragment } from 'react';
import type { AboutRun } from '@/data/about';

// anchor for public pages; text renders links as plain (non-clickable) labels for the inbox/editor
export type LinkMode = 'anchor' | 'text';

// the only gate protecting already-stored or hand-edited rows; a bad scheme renders as text
const SAFE_HREF = /^(https?:|mailto:)/i;

export function renderRun(run: AboutRun, key: number, linkMode: LinkMode = 'anchor') {
  if (typeof run === 'string') return <Fragment key={key}>{run}</Fragment>;
  if ('strong' in run) {
    return (
      <strong key={key} className="font-semibold text-text">
        {run.strong}
      </strong>
    );
  }
  if ('link' in run) {
    const { text, href } = run.link;
    const label = text || href;
    if (linkMode === 'text' || !SAFE_HREF.test(href)) return <Fragment key={key}>{label}</Fragment>;
    return (
      <a
        key={key}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent underline underline-offset-2 transition-colors hover:text-text"
      >
        {label}
      </a>
    );
  }
  return (
    <em key={key} className="font-semibold not-italic text-text">
      {run.em}
    </em>
  );
}
