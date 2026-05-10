import { Widget } from '@/components/console/Widget';
import { DegreeCard } from './DegreeCard';
import { CertificationsBlock } from './CertificationsBlock';
import { degrees } from '@/data/education';

export const EducationDetail: React.FC = () => (
  <Widget channel="05" label="EDUCATION" count={degrees.length} id="education">
    {degrees.map((d, i) => (
      <DegreeCard key={d.qualification} degree={d} defaultOpen={i === 0} />
    ))}
    <CertificationsBlock />
  </Widget>
);
