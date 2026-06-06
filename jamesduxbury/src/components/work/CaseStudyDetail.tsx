import Image from 'next/image';
import Link from 'next/link';
import type { CaseStudy } from '@/data/case-studies';
import type { Project } from '@/data/projects';
import { StatusChip } from '@/components/console/StatusChip';
import { renderRun } from '@/components/about/renderRun';
import { MetricBar } from './MetricBar';

interface CaseStudyDetailProps {
  project: Project;
  study: CaseStudy | null;
}

function ProseSection({ label, paragraphs }: { label: string; paragraphs: CaseStudy['problem'] }) {
  return (
    <section className="border-b border-border px-4 py-6 last:border-b-0 sm:px-6">
      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{label}</h2>
      {paragraphs.map((p, i) => (
        <p key={i} className="mt-3 text-sm leading-relaxed text-text/85 sm:text-base">
          {p.map(renderRun)}
        </p>
      ))}
    </section>
  );
}

export function CaseStudyDetail({ project, study }: CaseStudyDetailProps) {
  const yearLabel =
    project.yearEnd === project.yearStart
      ? `${project.yearStart}`
      : `${project.yearStart} — ${project.yearEnd}`;

  return (
    <article>
      <header className="border-b border-border pb-6">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <h1 className="font-mono text-2xl font-semibold text-text sm:text-3xl">
            {project.title}
          </h1>
          <span className="font-mono text-xs text-muted">{yearLabel}</span>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <StatusChip kind={project.status} />
            {project.underExam && <StatusChip kind="exam" />}
          </div>
        </div>
        <p className="mt-3 font-mono text-sm uppercase tracking-[0.15em] text-text/70">
          {project.subtitle}
        </p>
        <p className="mt-3 font-mono text-xs text-muted">{project.techStack.join('  ·  ')}</p>
        {(project.githubLink || project.liveLink) && (
          <div className="mt-4 flex flex-wrap items-center gap-4 font-mono text-xs">
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
        )}
      </header>

      {study ? (
        <div className="mt-6 border border-border bg-surface/40 backdrop-blur-sm">
          {study.imagePath && (
            <div className="border-b border-border">
              <Image
                src={study.imagePath}
                alt={`${project.title} illustration`}
                width={1200}
                height={675}
                className="h-auto w-full object-cover"
              />
            </div>
          )}
          <ProseSection label="Problem" paragraphs={study.problem} />
          <ProseSection label="Approach" paragraphs={study.approach} />
          {study.outcome && <ProseSection label="Outcome" paragraphs={study.outcome} />}
          {project.metrics && <MetricBar metrics={project.metrics} />}
        </div>
      ) : (
        <div className="mt-6 border border-border bg-surface/40 px-4 py-6 backdrop-blur-sm sm:px-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            {project.underExam ? 'under examination' : 'case study'}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-text/85 sm:text-base">
            {project.underExam
              ? 'The full write-up follows once marking completes. The highlights below cover the current state.'
              : 'The full write-up is in preparation. The highlights below cover the current state.'}
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text/85 sm:text-base">
            {project.highlights.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
