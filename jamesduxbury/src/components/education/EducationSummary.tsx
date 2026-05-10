import Link from 'next/link';
import { Widget } from '@/components/console/Widget';
import { DegreeCard } from './DegreeCard';
import { degrees } from '@/data/education';
import { certifications } from '@/data/certifications';

export const EducationSummary: React.FC = () => (
  <Widget channel="05" label="EDUCATION" count={degrees.length} id="education">
    <div>
      {degrees.map((d, i) => (
        <DegreeCard key={d.qualification} degree={d} defaultOpen={i === 0} />
      ))}
    </div>
    <Link
      href="/education"
      className="group flex items-center justify-between border-t border-border bg-bg/40 px-4 py-3 font-mono text-sm uppercase tracking-[0.18em] text-accent transition-colors hover:bg-accent/10 sm:px-6"
    >
      <span>+ {certifications.length} certifications</span>
      <span className="transition-transform group-hover:translate-x-1">open /education →</span>
    </Link>
  </Widget>
);
