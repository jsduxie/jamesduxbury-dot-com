import { Widget } from '@/components/console/Widget';
import { RoleCard } from './RoleCard';
import { roles } from '@/data/experience';

export const ExperienceDetail: React.FC = () => (
  <Widget channel="04" label="EXPERIENCE" count={roles.length} id="experience">
    {roles.map((role, i) => (
      <RoleCard key={`${role.organisation}-${role.period}`} role={role} defaultOpen={i === 0} />
    ))}
  </Widget>
);
