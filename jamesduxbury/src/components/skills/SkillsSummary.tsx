import Link from 'next/link';
import { Widget } from '@/components/console/Widget';
import { getSkillGroups } from '@/db/queries';
import { SkillIconBadge } from './SkillIconBadge';

export async function SkillsSummary() {
  const skillGroups = await getSkillGroups();
  return (
    <Widget channel="03" label="SKILLS" count={skillGroups.length} id="skills">
      <div className="divide-y divide-border">
        {skillGroups.map((group) => (
          <div key={group.heading} className="px-4 py-3 sm:px-6">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-text">
                {group.heading}
              </h3>
              <span className="font-mono text-xs text-muted">
                {group.skills.length} item{group.skills.length === 1 ? '' : 's'}
              </span>
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 font-mono text-xs text-muted">
              {group.skills.slice(0, 4).map((skill, index) => (
                <span key={skill} className="inline-flex items-center gap-1">
                  {index > 0 ? <span aria-hidden="true">·</span> : null}
                  <SkillIconBadge name={skill} />
                  {skill}
                </span>
              ))}
              {group.skills.length > 4 ? <span>· +{group.skills.length - 4}</span> : null}
            </p>
          </div>
        ))}
      </div>
      <Link
        href="/skills"
        className="group flex items-center justify-between border-t border-border bg-bg/40 px-4 py-3 font-mono text-sm uppercase tracking-[0.18em] text-accent transition-colors hover:bg-accent/10 sm:px-6"
      >
        <span>full skill set</span>
        <span className="transition-transform group-hover:translate-x-1">open /skills →</span>
      </Link>
    </Widget>
  );
}
