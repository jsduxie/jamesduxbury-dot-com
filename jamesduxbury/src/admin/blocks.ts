import { runText, type AboutRun, type Block, type Features } from '@/data/about';
import { parseRuns, serialiseRuns } from './runs';

export const ALL_FEATURES: Features = {
  bold: true,
  italic: true,
  code: true,
  link: true,
  list: true,
  heading: true,
  image: true,
};

// the public contact form gets formatting and links but never code, headings or image uploads
export const CONTACT_FEATURES: Features = {
  bold: true,
  italic: true,
  code: false,
  link: true,
  list: true,
  heading: false,
  image: false,
};

const IMAGE_LINE = /^!\[([^\]]*)\]\(([^)]+)\)$/;
const HEADING_LINE = /^###(?:\s+(.*))?$/;
// an empty item (- with nothing after it) is allowed so trimming a "- " line still reads as a list
const LIST_LINE = /^-(?:\s+(.*))?$/;

// each non-blank line is its own block; a single newline starts a new paragraph,
// blank lines only separate adjacent lists, and image/heading/list lines are recognised per line
export function parseBlocks(text: string, features: Features = ALL_FEATURES): Block[] {
  const blocks: Block[] = [];
  let list: AboutRun[][] = [];

  const flushList = () => {
    if (!list.length) return;
    blocks.push({ kind: 'list', items: list });
    list = [];
  };

  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (line === '') {
      flushList();
      continue;
    }
    const image = IMAGE_LINE.exec(line);
    if (image) {
      flushList();
      blocks.push({ kind: 'image', alt: image[1], url: image[2] });
      continue;
    }
    const heading = HEADING_LINE.exec(line);
    if (heading) {
      flushList();
      const runs = parseRuns(heading[1] ?? '');
      if (runs.length) blocks.push({ kind: 'heading', runs });
      continue;
    }
    const item = LIST_LINE.exec(line);
    if (item) {
      const runs = parseRuns(item[1] ?? '');
      if (runs.length) list.push(runs);
      continue;
    }
    flushList();
    const runs = parseRuns(line);
    if (runs.length) blocks.push({ kind: 'p', runs });
  }
  flushList();

  return applyFeatures(blocks, features);
}

export function serialiseBlock(block: Block): string {
  switch (block.kind) {
    case 'p':
      return serialiseRuns(block.runs);
    case 'heading':
      return `### ${serialiseRuns(block.runs)}`;
    case 'list':
      return block.items.map((item) => `- ${serialiseRuns(item)}`).join('\n');
    case 'image':
      return `![${block.alt}](${block.url})`;
  }
}

export function serialiseBlocks(blocks: Block[]): string {
  return blocks.map(serialiseBlock).join('\n\n');
}

// every image url embedded in a block document, used to track inline blob references
export function blockImageUrls(blocks: Block[]): string[] {
  return blocks.flatMap((block) => (block.kind === 'image' ? [block.url] : []));
}

// flattens a block document to plain text for metadata descriptions
export function proseText(blocks: Block[]): string {
  return blocks
    .map((block) => {
      if (block.kind === 'image') return block.alt;
      if (block.kind === 'list') return block.items.map(runText).join(' ');
      return runText(block.runs);
    })
    .join(' ');
}

// drops disallowed kinds (heading downgrades to paragraph, image is removed) and unwraps
// disallowed runs to plain text, so a restricted surface can never store more than it offers
export function applyFeatures(blocks: Block[], features: Features): Block[] {
  return blocks.flatMap((block): Block[] => {
    switch (block.kind) {
      case 'image':
        return features.image ? [block] : [];
      case 'heading': {
        const runs = stripRuns(block.runs, features);
        if (!runs.length) return [];
        return [{ kind: features.heading ? 'heading' : 'p', runs }];
      }
      case 'list': {
        const items = block.items.map((item) => stripRuns(item, features)).filter((i) => i.length);
        if (!items.length) return [];
        return features.list
          ? [{ kind: 'list', items }]
          : items.map((runs) => ({ kind: 'p', runs }));
      }
      case 'p': {
        const runs = stripRuns(block.runs, features);
        return runs.length ? [{ kind: 'p', runs }] : [];
      }
    }
  });
}

// unwraps any run the feature set forbids, coalescing adjacent strings so output stays canonical
function stripRuns(runs: AboutRun[], features: Features): AboutRun[] {
  const out: AboutRun[] = [];
  for (const run of runs) {
    let next: AboutRun = run;
    if (typeof next !== 'string') {
      if ('strong' in next && !features.bold) next = next.strong;
      else if ('em' in next && !features.italic) next = next.em;
      else if ('code' in next && !features.code) next = next.code;
      else if ('link' in next && !features.link) next = next.link.text;
    }
    if (next === '') continue;
    const last = out[out.length - 1];
    if (typeof next === 'string' && typeof last === 'string') out[out.length - 1] = last + next;
    else out.push(next);
  }
  return out;
}
