import type { Degree } from '@/data/education';
import { CollapsibleRow } from '@/components/console/CollapsibleRow';

interface DegreeCardProps {
  degree: Degree;
  defaultOpen?: boolean;
  open?: boolean;
  onToggle?: () => void;
}

export const DegreeCard: React.FC<DegreeCardProps> = ({
  degree,
  defaultOpen = false,
  open,
  onToggle,
}) => {
  const header = (
    <div className="space-y-1">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="font-mono text-sm font-semibold text-text sm:text-base">
          {degree.qualification}
        </h3>
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-muted">
          {degree.period}
        </span>
      </div>
      <p className="font-mono text-xs text-muted">{degree.institution}</p>
    </div>
  );

  if (!degree.bullets) {
    return (
      <div className="flex w-full items-start gap-3 border-b border-border px-4 py-3 last:border-b-0 sm:px-6">
        <span aria-hidden className="font-mono text-xs text-border">
          ▸
        </span>
        <div className="flex-1">{header}</div>
      </div>
    );
  }

  return (
    <CollapsibleRow header={header} defaultOpen={defaultOpen} open={open} onToggle={onToggle}>
      <ul className="ml-4 list-disc space-y-2 pl-2 text-sm leading-relaxed text-text/85">
        {degree.bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </CollapsibleRow>
  );
};
