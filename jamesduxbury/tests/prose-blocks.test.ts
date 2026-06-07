import { describe, expect, it } from 'vitest';
import { parseRuns, serialiseRuns } from '@/admin/runs';
import { ALL_FEATURES, applyFeatures, parseBlocks, serialiseBlocks } from '@/admin/blocks';
import type { Block, Features } from '@/data/about';

const restricted: Features = {
  bold: true,
  italic: true,
  link: true,
  list: true,
  heading: false,
  image: false,
};

describe('parseRuns', () => {
  it('parses plain, bold, and italic runs', () => {
    expect(parseRuns('a **b** c *d*')).toEqual(['a ', { strong: 'b' }, ' c ', { em: 'd' }]);
  });

  it('parses an http link and a mailto link', () => {
    expect(parseRuns('see [docs](https://x.dev)')).toEqual([
      'see ',
      { link: { text: 'docs', href: 'https://x.dev' } },
    ]);
    expect(parseRuns('[mail](mailto:a@b.com)')).toEqual([
      { link: { text: 'mail', href: 'mailto:a@b.com' } },
    ]);
  });

  it('leaves a javascript: link as literal text (scheme gate)', () => {
    expect(parseRuns('[x](javascript:alert(1))')).toEqual(['[x](javascript:alert(1))']);
  });

  it('leaves unclosed markup literal', () => {
    expect(parseRuns('[text](')).toEqual(['[text](']);
    expect(parseRuns('*unclosed')).toEqual(['*unclosed']);
  });

  it('round-trips through serialiseRuns', () => {
    const text = 'a **b** [c](https://d.dev) *e*';
    expect(serialiseRuns(parseRuns(text))).toBe(text);
  });
});

describe('parseBlocks grammar', () => {
  it('returns [] for empty or whitespace-only input', () => {
    expect(parseBlocks('')).toEqual([]);
    expect(parseBlocks('   \n\n  ')).toEqual([]);
  });

  it('splits paragraphs on blank lines and joins soft newlines', () => {
    expect(parseBlocks('one\ntwo\n\nthree')).toEqual([
      { kind: 'p', runs: ['one two'] },
      { kind: 'p', runs: ['three'] },
    ]);
  });

  it('parses headings, lists, and images', () => {
    const blocks = parseBlocks('### Title\n\n- a\n- b\n\n![alt](https://img.dev/x.png)');
    expect(blocks).toEqual([
      { kind: 'heading', runs: ['Title'] },
      { kind: 'list', items: [['a'], ['b']] },
      { kind: 'image', alt: 'alt', url: 'https://img.dev/x.png' },
    ]);
  });

  it('treats an image with surrounding text as a paragraph', () => {
    expect(parseBlocks('see ![x](y) here')).toEqual([{ kind: 'p', runs: ['see ![x](y) here'] }]);
  });

  it('drops empty list items and empty headings', () => {
    expect(parseBlocks('- \n- a')).toEqual([{ kind: 'list', items: [['a']] }]);
    expect(parseBlocks('### ')).toEqual([]);
  });
});

describe('applyFeatures', () => {
  it('downgrades headings to paragraphs and drops images', () => {
    const blocks: Block[] = [
      { kind: 'heading', runs: ['H'] },
      { kind: 'image', url: 'https://i.dev/a.png', alt: '' },
      { kind: 'p', runs: ['body'] },
    ];
    expect(applyFeatures(blocks, restricted)).toEqual([
      { kind: 'p', runs: ['H'] },
      { kind: 'p', runs: ['body'] },
    ]);
  });

  it('unwraps disallowed runs to text', () => {
    const blocks: Block[] = [
      { kind: 'p', runs: ['a ', { strong: 'b' }, { link: { text: 'c', href: 'https://x' } }] },
    ];
    const noBold: Features = { ...ALL_FEATURES, bold: false };
    expect(applyFeatures(blocks, noBold)).toEqual([
      { kind: 'p', runs: ['a b', { link: { text: 'c', href: 'https://x' } }] },
    ]);
  });

  it('is applied by parseBlocks for a restricted surface', () => {
    expect(parseBlocks('### H\n\n![a](https://i.dev/x.png)\n\ntext', restricted)).toEqual([
      { kind: 'p', runs: ['H'] },
      { kind: 'p', runs: ['text'] },
    ]);
  });
});

describe('idempotency', () => {
  it('reaches a fixed point after one parse', () => {
    const text = '### Title\n\nbody **bold** [l](https://x.dev)\n\n- a\n- b';
    const once = serialiseBlocks(parseBlocks(text));
    const twice = serialiseBlocks(parseBlocks(once));
    expect(twice).toBe(once);
  });
});
