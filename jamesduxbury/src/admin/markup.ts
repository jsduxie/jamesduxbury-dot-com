// real toggle/normalise logic for the inline wrappers (bold **, italic *, code `).
// markup never nests and wrapped content holds no marker chars (the run grammar forbids it),
// so a wrapper is a flat sequence of marker pairs that we can pair up, strip and rebuild.

interface Span {
  open: number;
  close: number;
}

// marker positions in the raw text; a lone * is skipped when it is part of a ** bold marker
function markerIndices(text: string, marker: string): number[] {
  const out: number[] = [];
  let i = 0;
  while (i < text.length) {
    if (marker === '*' && text[i] === '*' && text[i + 1] === '*') {
      i += 2;
      continue;
    }
    if (text.startsWith(marker, i)) {
      out.push(i);
      i += marker.length;
      continue;
    }
    i += 1;
  }
  return out;
}

function findSpans(text: string, marker: string): Span[] {
  const idx = markerIndices(text, marker);
  const spans: Span[] = [];
  for (let k = 0; k + 1 < idx.length; k += 2) spans.push({ open: idx[k], close: idx[k + 1] });
  return spans;
}

interface PlainRange {
  start: number;
  end: number;
}

interface Analysis {
  len: number;
  plain: string;
  plainAt: (raw: number) => number;
  ranges: PlainRange[];
}

// strips the marker chars out so selections and spans can be compared in plain-text coordinates
function analyse(text: string, marker: string): Analysis {
  const len = marker.length;
  const spans = findSpans(text, marker);
  const isMarker = new Array(text.length).fill(false);
  for (const span of spans) {
    for (let k = 0; k < len; k++) {
      isMarker[span.open + k] = true;
      isMarker[span.close + k] = true;
    }
  }
  let plain = '';
  for (let r = 0; r < text.length; r++) if (!isMarker[r]) plain += text[r];
  const plainAt = (raw: number) => {
    let count = 0;
    for (let r = 0; r < raw; r++) if (!isMarker[r]) count++;
    return count;
  };
  const ranges = spans.map((span) => ({
    start: plainAt(span.open + len),
    end: plainAt(span.close),
  }));
  return { len, plain, plainAt, ranges };
}

// true when the current selection sits entirely inside one wrapped span (drives the active toggle state)
export function selectionWrapped(
  text: string,
  start: number,
  end: number,
  marker: string,
): boolean {
  const { plainAt, ranges } = analyse(text, marker);
  const ps = plainAt(start);
  const pe = plainAt(end);
  if (pe > ps) return ranges.some((r) => r.start <= ps && pe <= r.end);
  return ranges.some((r) => r.start < ps && ps < r.end);
}

// toggles the wrapper over the selection: removes it when already wrapped, otherwise wraps and
// merges any overlapping span into one, returning the new text and the selection to restore
export function toggleWrap(
  text: string,
  start: number,
  end: number,
  marker: string,
): [string, number, number] {
  const { len, plain, plainAt, ranges } = analyse(text, marker);
  const ps = plainAt(start);
  const pe = plainAt(end);
  const collapsed = ps === pe;
  const wrapped = collapsed
    ? ranges.some((r) => r.start < ps && ps < r.end)
    : ranges.some((r) => r.start <= ps && pe <= r.end);

  // a collapsed caret outside any span just drops empty markers with the caret between them
  if (collapsed && !wrapped) {
    const at = start + len;
    return [text.slice(0, start) + marker + marker + text.slice(start), at, at];
  }

  const overlaps = (r: PlainRange) =>
    collapsed ? r.start <= ps && ps <= r.end : r.start < pe && ps < r.end;

  let finalRanges: PlainRange[];
  if (wrapped) {
    // toggling off: a bare caret drops the whole span, a real selection unbolds only
    // itself and keeps the wrapped parts before and after it
    finalRanges = collapsed
      ? ranges.filter((r) => !overlaps(r))
      : ranges.flatMap((r) => {
          if (!overlaps(r)) return [r];
          const parts: PlainRange[] = [];
          if (r.start < ps) parts.push({ start: r.start, end: ps });
          if (pe < r.end) parts.push({ start: pe, end: r.end });
          return parts;
        });
  } else {
    let a = ps;
    let b = pe;
    for (const r of ranges) {
      if (overlaps(r)) {
        a = Math.min(a, r.start);
        b = Math.max(b, r.end);
      }
    }
    finalRanges = ranges.filter((r) => !overlaps(r));
    finalRanges.push({ start: a, end: b });
  }
  finalRanges = finalRanges.filter((r) => r.end > r.start).sort((x, y) => x.start - y.start);

  let out = '';
  let p = 0;
  for (const r of finalRanges) {
    out += plain.slice(p, r.start) + marker + plain.slice(r.start, r.end) + marker;
    p = r.end;
  }
  out += plain.slice(p);

  // map the originally selected characters into the rebuilt string so they stay selected;
  // the left edge sits after an opening marker at the same spot, the right edge before a closing one
  const rawAt = (q: number, isStart: boolean) => {
    let off = q;
    for (const r of finalRanges) {
      if (isStart ? r.start <= q : r.start < q) off += len;
      if (isStart ? r.end <= q : r.end < q) off += len;
    }
    return off;
  };
  return [out, rawAt(ps, true), rawAt(pe, false)];
}
