'use client';

import { useEffect, useState } from 'react';

const GLYPHS = ['░', '▒'];
const JITTER_MS = 220;

// one shared ticker for every SkeletonBits so a page of placeholders costs one timer
const listeners = new Set<() => void>();
let ticker: ReturnType<typeof setInterval> | null = null;

function subscribe(listener: () => void) {
  listeners.add(listener);
  ticker ??= setInterval(() => listeners.forEach((l) => l()), JITTER_MS);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && ticker) {
      clearInterval(ticker);
      ticker = null;
    }
  };
}

interface SkeletonBitsProps {
  length: number;
  className?: string;
}

export function SkeletonBits({ length, className }: SkeletonBitsProps) {
  // deterministic first paint so server and client render the same string
  const [bits, setBits] = useState(() => '░'.repeat(length));

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    return subscribe(() =>
      // each bit re-rolls on roughly half the ticks so the field never moves in lockstep
      setBits((prev) =>
        Array.from(prev, (glyph) =>
          Math.random() < 0.5 ? glyph : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        ).join(''),
      ),
    );
  }, []);

  return (
    <span aria-hidden className={`select-none font-mono text-text/30 ${className ?? ''}`}>
      {bits}
    </span>
  );
}

export function SkeletonCursor() {
  return (
    <span aria-hidden className="skeleton-cursor select-none font-mono text-text/30">
      ▒
    </span>
  );
}

interface SkeletonLineProps {
  length: number;
  className?: string;
  textClassName?: string;
  cursor?: boolean;
}

export function SkeletonLine({
  length,
  className,
  textClassName,
  cursor = false,
}: SkeletonLineProps) {
  return (
    <p className={`overflow-hidden whitespace-nowrap ${className ?? ''}`}>
      <SkeletonBits length={length} className={textClassName} />
      {cursor && <SkeletonCursor />}
    </p>
  );
}
