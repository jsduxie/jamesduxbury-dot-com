import { Widget } from '@/components/console/Widget';
import { getAbout } from '@/db/queries';
import { renderBlocks } from './BlockView';

export async function AboutDetail() {
  const blocks = await getAbout();
  return (
    <Widget channel="01" label="ABOUT" id="about">
      <div className="space-y-4 px-4 py-6 text-sm leading-relaxed text-text/85 sm:px-6">
        {renderBlocks(blocks, { paragraphClass: '' })}
      </div>
    </Widget>
  );
}
