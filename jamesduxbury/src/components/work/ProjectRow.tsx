import Link from 'next/link';
import type { Project } from '@/data/projects';
import { StatusChip } from '@/components/console/StatusChip';
import { MetricBar } from './MetricBar';

interface ProjectRowProps {
  project: Project;
  index: number;
  variant?: 'compact' | 'detail';
}

export const ProjectRow: React.FC<ProjectRowProps> = ({ project, index, variant = 'detail' }) => {
  const positionLabel = `P${String(index + 1).padStart(1, '0')}`;
  const yearLabel =
    project.yearEnd === project.yearStart
      ? `${project.yearStart}`
      : `${project.yearStart} — ${project.yearEnd}`;

  const techPreview =
    variant === 'compact'
      ? project.techStack.slice(0, 3).join('  ·  ') +
        (project.techStack.length > 3 ? `  ·  +${project.techStack.length - 3}` : '')
      : project.techStack.join('  ·  ');

  return (
    <article className="border-b border-border last:border-b-0">
      <div className="px-4 py-6 transition-colors hover:bg-bg/40 sm:px-6 sm:py-7">
        <header className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            {positionLabel}
          </span>
          <h3 className="font-mono text-base font-semibold text-text sm:text-lg">
            <Link href={`/work/${project.slug}`} className="transition-colors hover:text-accent">
              {project.title}
            </Link>
          </h3>
          <span className="font-mono text-xs text-muted">{yearLabel}</span>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <StatusChip kind={project.status} />
            {project.underExam && <StatusChip kind="exam" />}
          </div>
        </header>

        <p className="mt-2 font-mono text-sm uppercase tracking-[0.15em] text-text/70">
          {project.subtitle}
        </p>

        <p className="mt-3 font-mono text-xs text-muted">{techPreview}</p>

        {variant === 'detail' && (
          <>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text/85 sm:text-base">
              {project.highlights.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>

            <div className="mt-4 flex flex-wrap items-center gap-4 font-mono text-xs">
              <Link
                href={`/work/${project.slug}`}
                className="inline-flex items-center gap-1 text-accent transition-colors hover:text-danger"
              >
                case study →
              </Link>
              {project.githubLink && (
                <Link
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-accent transition-colors hover:text-danger"
                >
                  view repo ↗
                </Link>
              )}
              {project.liveLink && (
                <Link
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-accent transition-colors hover:text-danger"
                >
                  open live ↗
                </Link>
              )}
            </div>
          </>
        )}
      </div>

      {variant === 'detail' && project.metrics && <MetricBar metrics={project.metrics} />}
    </article>
  );
};
