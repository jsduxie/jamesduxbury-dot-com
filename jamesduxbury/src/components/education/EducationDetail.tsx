import { Widget } from '@/components/console/Widget';
import { DegreeCard } from './DegreeCard';
import { CertificationsBlock } from './CertificationsBlock';
import { getDegrees } from '@/db/queries';

export async function EducationDetail() {
  const degrees = await getDegrees();
  return (
    <Widget channel="05" label="EDUCATION" count={degrees.length} id="education">
      {degrees.map((d, i) => (
        <DegreeCard key={d.qualification} degree={d} defaultOpen={i === 0} />
      ))}
      <CertificationsBlock />
    </Widget>
  );
}
