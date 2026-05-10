import type { Degree } from '@/data/education';
import { CollapsibleRow } from '@/components/console/CollapsibleRow';

interface DegreeCardProps {
  degree: Degree;
  defaultOpen?: boolean;
}

export const DegreeCard: React.FC<DegreeCardProps> = ({ degree, defaultOpen = false }) => {
  const header = (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <h3 className="font-mono text-sm font-semibold text-text sm:text-base">
        {degree.qualification}
      </h3>
      <span className="font-mono text-xs text-muted">{degree.institution}</span>
      <span className="ml-auto font-mono text-[0.65rem] uppercase tracking-[0.15em] text-muted">
        {degree.period}
      </span>
    </div>
  );

  if (!degree.bullets) {
    return (
      <div className="flex w-full items-center gap-3 border-b border-border px-4 py-3 last:border-b-0 sm:px-6">
        <span aria-hidden className="font-mono text-xs text-border">
          ▸
        </span>
        <div className="flex-1">{header}</div>
      </div>
    );
  }

  return (
    <CollapsibleRow header={header} defaultOpen={defaultOpen}>
      <ul className="ml-4 list-disc space-y-2 pl-2 text-sm leading-relaxed text-text/85">
        {degree.bullets.map((b, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: b }} />
        ))}
      </ul>
    </CollapsibleRow>
  );
};
