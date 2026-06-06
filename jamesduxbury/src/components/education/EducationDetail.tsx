import { Widget } from '@/components/console/Widget';
import { DegreeList } from './DegreeList';
import { CertificationsBlock } from './CertificationsBlock';
import { getDegrees } from '@/db/queries';

export async function EducationDetail() {
  const degrees = await getDegrees();
  return (
    <Widget channel="05" label="EDUCATION" count={degrees.length} id="education">
      <DegreeList degrees={degrees} />
      <CertificationsBlock />
    </Widget>
  );
}
