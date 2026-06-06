import { Widget } from '@/components/console/Widget';
import { getAboutParagraphs } from '@/db/queries';
import { renderRun } from './renderRun';

export async function AboutDetail() {
  const aboutParagraphs = await getAboutParagraphs();
  return (
    <Widget channel="01" label="ABOUT" id="about">
      <div className="space-y-4 px-4 py-6 text-base leading-relaxed text-text/85 sm:px-6 sm:text-lg">
        {aboutParagraphs.map((paragraph, i) => (
          <p key={i}>{paragraph.map(renderRun)}</p>
        ))}
      </div>
    </Widget>
  );
}
