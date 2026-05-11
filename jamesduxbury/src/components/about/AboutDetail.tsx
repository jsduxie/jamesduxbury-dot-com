import { Widget } from '@/components/console/Widget';
import { aboutParagraphs } from '@/data/about';
import { renderRun } from './renderRun';

export const AboutDetail: React.FC = () => (
  <Widget channel="01" label="TRANSMISSION" id="about">
    <div className="space-y-4 px-4 py-6 text-base leading-relaxed text-text/85 sm:px-6 sm:text-lg">
      {aboutParagraphs.map((paragraph, i) => (
        <p key={i}>{paragraph.map(renderRun)}</p>
      ))}
    </div>
  </Widget>
);
