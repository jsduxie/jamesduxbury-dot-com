import { BlobImage } from '@/components/BlobImage';
import type { Block } from '@/data/about';
import { renderRun, type LinkMode } from './renderRun';

interface BlockViewOptions {
  linkMode?: LinkMode;
  paragraphClass?: string;
}

const DEFAULT_PARAGRAPH = 'text-sm leading-relaxed text-text/85 sm:text-base';

// plain function component so the same renderer runs on public pages (server) and the editor (client)
export function BlockView({
  block,
  linkMode = 'anchor',
  paragraphClass = DEFAULT_PARAGRAPH,
}: { block: Block } & BlockViewOptions) {
  switch (block.kind) {
    case 'p':
      return (
        <p className={paragraphClass || undefined}>
          {block.runs.map((r, i) => renderRun(r, i, linkMode))}
        </p>
      );
    case 'heading':
      return (
        <h3 className="mt-4 font-mono text-sm uppercase tracking-[0.15em] text-text">
          {block.runs.map((r, i) => renderRun(r, i, linkMode))}
        </h3>
      );
    case 'list':
      return (
        <ul className={`list-disc space-y-1 pl-5 ${paragraphClass}`}>
          {block.items.map((item, i) => (
            <li key={i}>{item.map((r, j) => renderRun(r, j, linkMode))}</li>
          ))}
        </ul>
      );
    case 'image':
      return (
        <BlobImage
          wrapperClassName="my-4 border border-border"
          src={block.url}
          alt={block.alt}
          width={1200}
          height={675}
          unoptimized
          className="h-auto w-full object-cover"
        />
      );
  }
}

export function renderBlocks(blocks: Block[], options?: BlockViewOptions) {
  return blocks.map((block, i) => <BlockView key={i} block={block} {...options} />);
}
