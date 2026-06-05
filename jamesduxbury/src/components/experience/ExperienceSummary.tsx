import Link from 'next/link';
import { Widget } from '@/components/console/Widget';
import { RoleCard } from './RoleCard';
import { getRoles } from '@/db/queries';

export async function ExperienceSummary() {
  const roles = await getRoles();
  return (
    <Widget channel="04" label="EXPERIENCE" count={roles.length} id="experience">
      <div>
        {roles.map((role, i) => (
          <RoleCard key={`${role.organisation}-${role.period}`} role={role} defaultOpen={i === 0} />
        ))}
      </div>
      <Link
        href="/experience"
        className="group flex items-center justify-between border-t border-border bg-bg/40 px-4 py-3 font-mono text-sm uppercase tracking-[0.18em] text-accent transition-colors hover:bg-accent/10 sm:px-6"
      >
        <span>full history</span>
        <span className="transition-transform group-hover:translate-x-1">open /experience →</span>
      </Link>
    </Widget>
  );
}
