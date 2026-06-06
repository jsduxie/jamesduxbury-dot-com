// @vitest-environment jsdom
import { act, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SkeletonBits, SkeletonCursor, SkeletonLine } from '../src/components/skeleton/Skeleton';

function stubReducedMotion(matches: boolean) {
  const original = window.matchMedia;
  window.matchMedia = ((query: string) =>
    ({
      matches,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList) as typeof window.matchMedia;
  return () => {
    window.matchMedia = original;
  };
}

describe('SkeletonBits', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the requested number of block characters, hidden from the tree', () => {
    const { container } = render(<SkeletonBits length={12} />);
    const span = container.querySelector('span');
    expect(span).toHaveAttribute('aria-hidden', 'true');
    expect(span?.textContent).toHaveLength(12);
    expect(span?.textContent).toMatch(/^[░▒]+$/);
  });

  it('re-rolls characters over time but only ever uses block glyphs', () => {
    vi.useFakeTimers();
    const { container } = render(<SkeletonBits length={24} />);
    const span = container.querySelector('span');
    const before = span?.textContent;

    act(() => {
      vi.advanceTimersByTime(220 * 6);
    });

    const after = span?.textContent;
    expect(after).toHaveLength(24);
    expect(after).toMatch(/^[░▒]+$/);
    // 24 bits over 6 ticks: the odds of zero re-rolls are negligible
    expect(after).not.toBe(before);
  });

  it('shares one ticker across instances', () => {
    vi.useFakeTimers();
    const spy = vi.spyOn(globalThis, 'setInterval');
    const { unmount } = render(
      <>
        <SkeletonBits length={8} />
        <SkeletonBits length={8} />
        <SkeletonBits length={8} />
      </>,
    );
    expect(spy).toHaveBeenCalledTimes(1);
    unmount();
    spy.mockRestore();
  });

  it('does not animate when the user prefers reduced motion', () => {
    const restore = stubReducedMotion(true);
    vi.useFakeTimers();

    const { container } = render(<SkeletonBits length={16} />);
    const before = container.querySelector('span')?.textContent;

    act(() => {
      vi.advanceTimersByTime(220 * 10);
    });

    expect(container.querySelector('span')?.textContent).toBe(before);
    restore();
  });
});

describe('SkeletonCursor', () => {
  it('renders an aria-hidden blinking block with the cursor animation class', () => {
    const { container } = render(<SkeletonCursor />);
    const span = container.querySelector('span');
    expect(span).toHaveAttribute('aria-hidden', 'true');
    expect(span).toHaveClass('skeleton-cursor');
    expect(span?.textContent?.trim()).toBe('▒');
  });
});

describe('SkeletonLine', () => {
  it('renders a clipped line of bits with an optional cursor', () => {
    const { container } = render(<SkeletonLine length={20} cursor />);
    const line = container.querySelector('p');
    expect(line).toHaveClass('overflow-hidden', 'whitespace-nowrap');
    expect(line?.querySelector('.skeleton-cursor')).not.toBeNull();
    expect(line?.textContent?.replace(/\s/g, '')).toHaveLength(21);
  });
});
