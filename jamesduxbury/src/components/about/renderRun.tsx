import { Fragment } from 'react';
import type { AboutRun } from '@/data/about';

export function renderRun(run: AboutRun, key: number) {
  if (typeof run === 'string') return <Fragment key={key}>{run}</Fragment>;
  if ('strong' in run) {
    return (
      <strong key={key} className="font-semibold text-text">
        {run.strong}
      </strong>
    );
  }
  return (
    <em key={key} className="font-semibold not-italic text-text">
      {run.em}
    </em>
  );
}
