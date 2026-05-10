import { Fragment } from 'react';
import type { Project } from '@/data/projects';

interface ProjectTimelineProps {
  projects: Project[];
}

const STATUS_COLOUR: Record<Project['status'], string> = {
  live: 'bg-live/70',
  dev: 'bg-dev/70',
  exam: 'bg-danger/70',
  shipped: 'bg-accent/70',
};

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ projects }) => {
  const minYear = Math.min(...projects.map((p) => p.yearStart));
  const maxYear = Math.max(...projects.map((p) => p.yearEnd));
  const span = Math.max(1, maxYear - minYear + 1); // inclusive year count
  const years = Array.from({ length: span }, (_, i) => minYear + i);

  return (
    <div className="border-b border-border bg-bg/40 px-4 py-5 sm:px-6">
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-muted">Timeline</p>

      <div className="grid grid-cols-[10rem_1fr] gap-x-4 gap-y-1.5 sm:grid-cols-[12rem_1fr]">
        {/* spacer for label column, year axis */}
        <span aria-hidden />
        <div
          className="grid font-mono text-[0.65rem] text-muted"
          style={{ gridTemplateColumns: `repeat(${span}, minmax(0, 1fr))` }}
        >
          {years.map((y) => (
            <span key={y} className="border-l border-border pl-1 first:border-l-0 first:pl-0">
              {y}
            </span>
          ))}
        </div>

        {/* rows */}
        {projects.map((p) => {
          const offset = ((p.yearStart - minYear) / span) * 100;
          const width = ((p.yearEnd - p.yearStart + 1) / span) * 100;
          const colour =
            (p.underExam ? STATUS_COLOUR.exam : STATUS_COLOUR[p.status]) ?? 'bg-accent/70';
          return (
            <Fragment key={p.slug}>
              <span
                className="truncate font-mono text-xs uppercase tracking-[0.15em] text-text/85"
                title={p.title}
              >
                {p.title}
              </span>
              <div className="relative h-3">
                <div
                  className={`absolute top-0 h-3 rounded-sm ${colour}`}
                  style={{ left: `${offset}%`, width: `${width}%` }}
                  aria-label={`${p.title}: ${p.yearStart}–${p.yearEnd}`}
                />
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};
