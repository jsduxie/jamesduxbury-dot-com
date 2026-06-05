import { Widget } from '@/components/console/Widget';
import { getSkillGroups } from '@/db/queries';

export async function SkillsDetail() {
  const skillGroups = await getSkillGroups();
  return (
    <Widget channel="03" label="SKILLS" count={skillGroups.length} id="skills">
      <div className="divide-y divide-border">
        {skillGroups.map((group) => (
          <div key={group.heading} className="px-4 py-5 sm:px-6">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-mono text-sm uppercase tracking-[0.18em] text-text">
                {group.heading}
              </h3>
              <span className="font-mono text-xs text-muted">{group.skills.length} items</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <span key={skill} className="skill-badge">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Widget>
  );
}
