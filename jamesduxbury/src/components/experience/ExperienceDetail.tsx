import { Widget } from '@/components/console/Widget';
import { RoleCard } from './RoleCard';
import { getRoles } from '@/db/queries';

export async function ExperienceDetail() {
  const roles = await getRoles();
  return (
    <Widget channel="04" label="EXPERIENCE" count={roles.length} id="experience">
      {roles.map((role, i) => (
        <RoleCard key={`${role.organisation}-${role.period}`} role={role} defaultOpen={i === 0} />
      ))}
    </Widget>
  );
}
