import type { PageTransition } from '@/db/analytics';

const WIDTH = 640;
const LABEL_W = 150;
const NODE_W = 6;
const GAP = 10;
const MIN_H = 14;
const COLUMN_H = 200;

interface Node {
  path: string;
  y: number;
  h: number;
}

// node heights sum their ribbons' floored widths so ribbons always fit inside
function stack(heights: Map<string, number>): Map<string, Node> {
  const nodes = new Map<string, Node>();
  let y = 0;
  for (const [path, sum] of [...heights.entries()].sort((a, b) => b[1] - a[1])) {
    const h = Math.max(sum, MIN_H);
    nodes.set(path, { path, y, h });
    y += h + GAP;
  }
  return nodes;
}

function truncate(path: string): string {
  return path.length > 20 ? `${path.slice(0, 19)}…` : path;
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

  const totalCount = transitions.reduce((a, t) => a + t.count, 0);
  const scale = COLUMN_H / totalCount;
  const thicknessOf = (count: number) => Math.max(count * scale, 2);

  const fromHeights = new Map<string, number>();
  const toHeights = new Map<string, number>();
  for (const t of transitions) {
    fromHeights.set(t.from, (fromHeights.get(t.from) ?? 0) + thicknessOf(t.count));
    toHeights.set(t.to, (toHeights.get(t.to) ?? 0) + thicknessOf(t.count));
  }

  const left = stack(fromHeights);
  const right = stack(toHeights);
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
      const thickness = thicknessOf(t.count);
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
          key={`${r.from} → ${r.to}`}
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
            {truncate(n.path)}
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
            {truncate(n.path)}
          </text>
        </g>
      ))}
    </svg>
  );
}
