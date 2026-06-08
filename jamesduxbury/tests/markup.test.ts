import { describe, expect, it } from 'vitest';
import { selectionWrapped, toggleWrap } from '@/admin/markup';

// returns the new text only; caret position is exercised through the editor DOM tests
function wrap(text: string, start: number, end: number, marker = '**'): string {
  return toggleWrap(text, start, end, marker)[0];
}

describe('toggleWrap', () => {
  it('wraps a plain selection', () => {
    expect(wrap('hello', 0, 5)).toBe('**hello**');
  });

  it('toggles off an already wrapped selection rather than nesting markers', () => {
    expect(wrap('**hello**', 2, 7)).toBe('hello');
    expect(wrap('**hello**', 0, 9)).toBe('hello');
  });

  it('normalises an overlapping selection into one span', () => {
    const text = '**Hello, my name is James.** This is a second sentence';
    const start = text.indexOf('James');
    expect(wrap(text, start, text.length)).toBe(
      '**Hello, my name is James. This is a second sentence**',
    );
  });

  it('toggles a collapsed caret inside a span off', () => {
    expect(wrap('**hello**', 4, 4)).toBe('hello');
  });

  it('unbolds only the selected middle and keeps the ends bold', () => {
    expect(toggleWrap('**hello world**', 5, 10, '**')).toEqual(['**hel**lo wo**rld**', 7, 12]);
  });

  it('inserts empty markers for a collapsed caret outside a span', () => {
    expect(wrap('ab', 1, 1)).toBe('a****b');
  });

  it('works for italic without confusing the bold marker', () => {
    expect(wrap('hi', 0, 2, '*')).toBe('*hi*');
    expect(wrap('*hi*', 1, 3, '*')).toBe('hi');
    // a lone-star toggle must treat the ** as content, not split it into italic markers
    expect(wrap('**bold**', 2, 6, '*')).toBe('***bold***');
  });

  it('works for code backticks', () => {
    expect(wrap('run', 0, 3, '`')).toBe('`run`');
    expect(wrap('`run`', 1, 4, '`')).toBe('run');
  });

  it('keeps the wrapped text selected, inside the new markers', () => {
    expect(toggleWrap('hello', 0, 5, '**')).toEqual(['**hello**', 2, 7]);
  });

  it('keeps the same text selected after toggling off', () => {
    expect(toggleWrap('**hello**', 2, 7, '**')).toEqual(['hello', 0, 5]);
  });
});

describe('selectionWrapped', () => {
  it('reports a fully wrapped selection', () => {
    expect(selectionWrapped('**hello**', 2, 7, '**')).toBe(true);
  });

  it('reports an unwrapped selection', () => {
    expect(selectionWrapped('hello', 0, 5, '**')).toBe(false);
  });

  it('reports a partial overlap as not wrapped', () => {
    const text = '**Hello James** rest';
    expect(selectionWrapped(text, text.indexOf('James'), text.length, '**')).toBe(false);
  });

  it('reports a collapsed caret inside a span', () => {
    expect(selectionWrapped('**hello**', 4, 4, '**')).toBe(true);
    expect(selectionWrapped('hello', 2, 2, '**')).toBe(false);
  });
});
