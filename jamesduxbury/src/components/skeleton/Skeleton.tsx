'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const GLYPHS = ['░', '▒'];
const JITTER_MS = 220;

interface SkeletonBitsProps {
  length: number;
  className?: string;
}

export function SkeletonBits({ length, className }: SkeletonBitsProps) {
  const reduceMotion = useReducedMotion();
  // deterministic first paint so server and client render the same string
  const [bits, setBits] = useState(() => '░'.repeat(length));

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => {
      // each bit re-rolls on roughly half the ticks so the field never moves in lockstep
      setBits((prev) =>
        Array.from(prev, (glyph) =>
          Math.random() < 0.5 ? glyph : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        ).join(''),
      );
    }, JITTER_MS);
    return () => clearInterval(id);
  }, [length, reduceMotion]);

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
