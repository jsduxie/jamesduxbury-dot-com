import { Fragment } from 'react';
import type { AboutRun } from '@/data/about';
import { SAFE_HREF } from '@/lib/href';

// anchor for public pages; text renders links as plain (non-clickable) labels for the inbox/editor
export type LinkMode = 'anchor' | 'text';

export function renderRun(run: AboutRun, key: number, linkMode: LinkMode = 'anchor') {
  if (typeof run === 'string') return <Fragment key={key}>{run}</Fragment>;
  if ('strong' in run) {
    return (
      <strong key={key} className="font-semibold text-text">
        {run.strong}
      </strong>
    );
  }
  if ('code' in run) {
    return (
      <code
        key={key}
        className="rounded border border-border bg-surface px-1 py-0.5 font-mono text-[0.85em] text-text"
      >
        {run.code}
      </code>
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
