import type { Role } from '@/data/experience';
import { CollapsibleRow } from '@/components/console/CollapsibleRow';

interface RoleCardProps {
  role: Role;
  defaultOpen?: boolean;
}

export const RoleCard: React.FC<RoleCardProps> = ({ role, defaultOpen = false }) => {
  const isCurrent = role.yearEnd === 'present';

  const header = (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <h3 className="font-mono text-sm font-semibold text-text sm:text-base">{role.title}</h3>
      <span className="font-mono text-xs text-muted">
        {role.organisation}
        {role.meta && <span className="text-border"> · {role.meta}</span>}
      </span>
      <span className="ml-auto flex items-center gap-2">
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-muted">
          {role.period}
        </span>
        {isCurrent && (
          <span className="rounded-full border border-live/40 bg-live/10 px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-live">
            Current
          </span>
        )}
      </span>
    </div>
  );

  if (!role.bullets) {
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
        {role.bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </CollapsibleRow>
  );
};
