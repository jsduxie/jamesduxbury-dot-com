import type { PageTransition } from '@/db/analytics';

const WIDTH = 640;
const LABEL_W = 150;
const NODE_W = 6;
const GAP = 10;
const MIN_H = 14;
const COLUMN_H = 200;

interface Node {
  path: string;
  total: number;
  y: number;
  h: number;
}

function stack(totals: Map<string, number>, scale: number): Map<string, Node> {
  const nodes = new Map<string, Node>();
  let y = 0;
  for (const [path, total] of [...totals.entries()].sort((a, b) => b[1] - a[1])) {
    const h = Math.max(total * scale, MIN_H);
    nodes.set(path, { path, total, y, h });
    y += h + GAP;
  }
  return nodes;
}

function columnHeight(nodes: Map<string, Node>): number {
  let max = 0;
  for (const n of nodes.values()) max = Math.max(max, n.y + n.h);
  return max;
}

export function VisitFlow({ transitions }: { transitions: PageTransition[] }) {
  if (transitions.length === 0) {
    return (
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
        {`>`} no multi-page sessions yet
      </p>
    );
  }

  const fromTotals = new Map<string, number>();
  const toTotals = new Map<string, number>();
  for (const t of transitions) {
    fromTotals.set(t.from, (fromTotals.get(t.from) ?? 0) + t.count);
    toTotals.set(t.to, (toTotals.get(t.to) ?? 0) + t.count);
  }
  const maxColumn = Math.max(
    [...fromTotals.values()].reduce((a, b) => a + b, 0),
    [...toTotals.values()].reduce((a, b) => a + b, 0),
  );
  const scale = COLUMN_H / maxColumn;

  const left = stack(fromTotals, scale);
  const right = stack(toTotals, scale);
  const height = Math.max(columnHeight(left), columnHeight(right));

  // ribbons leave each node in descending count order, tracked by running offsets
  const leftOffset = new Map<string, number>();
  const rightOffset = new Map<string, number>();
  const x1 = LABEL_W + NODE_W;
  const x2 = WIDTH - LABEL_W - NODE_W;
  const midX = (x1 + x2) / 2;
  const ribbons = [...transitions]
    .sort((a, b) => b.count - a.count)
    .map((t) => {
      const from = left.get(t.from)!;
      const to = right.get(t.to)!;
      const thickness = Math.max(t.count * scale, 2);
      const y1 = from.y + (leftOffset.get(t.from) ?? 0) + thickness / 2;
      const y2 = to.y + (rightOffset.get(t.to) ?? 0) + thickness / 2;
      leftOffset.set(t.from, (leftOffset.get(t.from) ?? 0) + thickness);
      rightOffset.set(t.to, (rightOffset.get(t.to) ?? 0) + thickness);
      return { ...t, thickness, d: `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}` };
    });

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${height}`}
      className="w-full"
      role="img"
      aria-label="visit flow between pages"
    >
      {ribbons.map((r) => (
        <path
          key={`${r.from}-${r.to}`}
          d={r.d}
          fill="none"
          strokeWidth={r.thickness}
          className="stroke-accent/30"
        >
          <title>{`${r.from} → ${r.to} · ${r.count}`}</title>
        </path>
      ))}
      {[...left.values()].map((n) => (
        <g key={`from-${n.path}`}>
          <rect x={LABEL_W} y={n.y} width={NODE_W} height={n.h} className="fill-accent" />
          <text
            x={LABEL_W - 8}
            y={n.y + n.h / 2 + 4}
            textAnchor="end"
            fontSize={11}
            className="fill-muted font-mono"
          >
            {n.path}
          </text>
        </g>
      ))}
      {[...right.values()].map((n) => (
        <g key={`to-${n.path}`}>
          <rect
            x={WIDTH - LABEL_W - NODE_W}
            y={n.y}
            width={NODE_W}
            height={n.h}
            className="fill-accent"
          />
          <text
            x={WIDTH - LABEL_W + 8}
            y={n.y + n.h / 2 + 4}
            fontSize={11}
            className="fill-muted font-mono"
          >
            {n.path}
          </text>
        </g>
      ))}
    </svg>
  );
}
