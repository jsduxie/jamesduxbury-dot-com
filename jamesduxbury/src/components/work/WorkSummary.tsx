import Link from 'next/link';
import { Widget } from '@/components/console/Widget';
import { ProjectRow } from './ProjectRow';
import { projects } from '@/data/projects';

const SUMMARY_COUNT = 3;

export const WorkSummary: React.FC = () => {
  const top = projects.slice(0, SUMMARY_COUNT);
  const remaining = projects.length - top.length;

  return (
    <Widget channel="02" label="WORK" count={projects.length} id="work">
      <div className="divide-y divide-border">
        {top.map((project, i) => (
          <ProjectRow key={project.slug} project={project} index={i} variant="compact" />
        ))}
      </div>
      <Link
        href="/work"
        className="group flex items-center justify-between border-t border-border bg-bg/40 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-accent transition-colors hover:bg-accent/10 sm:px-6"
      >
        <span>{remaining > 0 ? `+ ${remaining} more` : 'view all'}</span>
        <span className="transition-transform group-hover:translate-x-1">open /work →</span>
      </Link>
    </Widget>
  );
};
