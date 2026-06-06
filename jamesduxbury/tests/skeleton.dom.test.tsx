// @vitest-environment jsdom
import { act, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const reducedMotion = vi.fn(() => false);
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal<typeof import('framer-motion')>();
  return { ...actual, useReducedMotion: () => reducedMotion() };
});

import { SkeletonBits, SkeletonCursor } from '../src/components/skeleton/Skeleton';

describe('SkeletonBits', () => {
  afterEach(() => {
    vi.useRealTimers();
    reducedMotion.mockReturnValue(false);
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

  it('does not animate when the user prefers reduced motion', () => {
    reducedMotion.mockReturnValue(true);
    vi.useFakeTimers();

    const { container } = render(<SkeletonBits length={16} />);
    const before = container.querySelector('span')?.textContent;

    act(() => {
      vi.advanceTimersByTime(220 * 10);
    });

    expect(container.querySelector('span')?.textContent).toBe(before);
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
