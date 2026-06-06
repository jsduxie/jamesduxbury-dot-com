import { Widget } from '@/components/console/Widget';
import { RoleList } from './RoleList';
import { getRoles } from '@/db/queries';

export async function ExperienceDetail() {
  const roles = await getRoles();
  return (
    <Widget channel="04" label="EXPERIENCE" count={roles.length} id="experience">
      <RoleList roles={roles} />
    </Widget>
  );
}
