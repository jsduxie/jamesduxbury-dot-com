'use client';

import { useState } from 'react';

const W = 720;
const NODE_W = 104;
const NODE_H = 32;
const col = (c: number) => 8 + c * 118;

interface DiagramNode {
  id: string;
  label: string;
  x: number;
  y: number;
  w?: number;
  desc: string;
}

const NODES: DiagramNode[] = [
  {
    id: 'pages',
    label: 'public pages',
    x: col(0),
    y: 34,
    desc: 'server-rendered pages, statically cached by ISR',
  },
  {
    id: 'beacon',
    label: 'visit beacon',
    x: col(1),
    y: 34,
    desc: 'posts one view per page; an exit beacon adds the duration',
  },
  { id: 'form', label: 'contact form', x: col(2), y: 34, desc: 'sends a message from /contact' },
  {
    id: 'routes',
    label: 'public routes',
    x: col(0),
    y: 148,
    desc: 'read content from Postgres; revalidated every 60s and on admin save',
  },
  {
    id: 'visit',
    label: '/api/visit',
    x: col(1),
    y: 148,
    desc: 'records anonymous views; bots and the signed-in admin are skipped',
  },
  {
    id: 'contact',
    label: '/api/contact',
    x: col(2),
    y: 148,
    desc: 'stores the message and emails it; fails only if both channels fail',
  },
  {
    id: 'admin',
    label: 'admin console',
    x: col(4),
    y: 122,
    desc: 'schema-driven console behind the GitHub allowlist; each section is config',
  },
  {
    id: 'actions',
    label: 'server actions',
    x: col(4),
    y: 174,
    desc: 'authz-checked writes to Postgres; saves revalidate every public route',
  },
  {
    id: 'auth',
    label: 'next-auth',
    x: col(5),
    y: 174,
    desc: 'JWT sessions; only the jsduxie GitHub login is allowed in',
  },
  {
    id: 'content',
    label: 'content tables',
    x: col(0),
    y: 270,
    desc: 'one table per content section, ordered by sort_order',
  },
  {
    id: 'views',
    label: 'page_views',
    x: col(1),
    y: 270,
    desc: 'session id, path, referrer, country and duration; no cookies or IPs',
  },
  {
    id: 'messages',
    label: 'messages',
    x: col(2),
    y: 270,
    desc: 'contact submissions, read in the admin inbox',
  },
  {
    id: 'email',
    label: 'email',
    x: 375,
    y: 270,
    desc: 'nodemailer delivery of contact messages',
  },
  {
    id: 'blob',
    label: 'vercel blob',
    x: 490,
    y: 270,
    desc: 'images uploaded from the console, served from the CDN',
  },
  { id: 'oauth', label: 'github oauth', x: 605, y: 270, desc: 'one OAuth app per environment' },
  {
    id: 'ci',
    label: 'github actions · checks',
    x: col(0),
    y: 358,
    w: 222,
    desc: 'format, lint, typecheck and coverage-gated tests on every PR',
  },
  {
    id: 'deploy',
    label: 'vercel build · migrate',
    x: col(2),
    y: 358,
    w: 222,
    desc: 'every deploy migrates its target database before next build runs',
  },
];

const EDGES: [string, string][] = [
  ['pages', 'routes'],
  ['beacon', 'visit'],
  ['form', 'contact'],
  ['routes', 'content'],
  ['visit', 'views'],
  ['contact', 'messages'],
  ['contact', 'email'],
  ['admin', 'actions'],
  ['admin', 'auth'],
  ['actions', 'content'],
  ['actions', 'blob'],
  ['auth', 'oauth'],
];

const LANES = [
  { label: 'visitor browser', x: 0, w: W, y: 0, h: 76 },
  { label: 'next.js on vercel', x: 0, w: W, y: 88, h: 130 },
  { label: 'neon postgres', x: 0, w: 356, y: 236, h: 76 },
  { label: 'external', x: 364, w: 356, y: 236, h: 76 },
  { label: 'ci and deployment', x: 0, w: W, y: 324, h: 76 },
];

const H = 404;

// corridor-routed edges avoid diagonal sweeps; xOff keeps merged arrowheads apart
const VIA: Record<string, { y: number; xOff?: number }> = {
  'actions-content': { y: 230, xOff: 12 },
  'contact-email': { y: 222 },
};

function edgePath([from, to]: [string, string]): string {
  const a = NODES.find((n) => n.id === from)!;
  const b = NODES.find((n) => n.id === to)!;
  const x1 = a.x + (a.w ?? NODE_W) / 2;
  const y1 = a.y + NODE_H;
  const y2 = b.y - 3;
  const via = VIA[`${from}-${to}`];
  const x2 = b.x + (b.w ?? NODE_W) / 2 + (via?.xOff ?? 0);
  if (via) {
    const dir = x2 > x1 ? 1 : -1;
    return [
      `M ${x1} ${y1} L ${x1} ${via.y - 8}`,
      `Q ${x1} ${via.y} ${x1 + 8 * dir} ${via.y}`,
      `L ${x2 - 8 * dir} ${via.y}`,
      `Q ${x2} ${via.y} ${x2} ${via.y + 8}`,
      `L ${x2} ${y2}`,
    ].join(' ');
  }
  return `M ${x1} ${y1} C ${x1} ${y1 + 26}, ${x2} ${y2 - 26}, ${x2} ${y2}`;
}

export function ArchDiagram() {
  const [active, setActive] = useState<string | null>(null);

  const linked = new Set(
    active ? [active, ...EDGES.filter((e) => e.includes(active)).flat()] : NODES.map((n) => n.id),
  );
  const edgeOn = ([from, to]: [string, string]) => active === from || active === to;

  return (
    <div>
      {/* scrolls instead of shrinking so labels stay legible on small screens */}
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full min-w-[640px]"
          role="img"
          aria-label="system diagram"
        >
          <defs>
            <marker
              id="arch-arrow"
              viewBox="0 0 6 6"
              refX="5"
              refY="3"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 6 3 L 0 6 z" className="fill-muted" />
            </marker>
            <marker
              id="arch-arrow-on"
              viewBox="0 0 6 6"
              refX="5"
              refY="3"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 6 3 L 0 6 z" className="fill-accent" />
            </marker>
          </defs>

          {LANES.map((lane) => (
            <rect
              key={lane.label}
              x={lane.x + 0.5}
              y={lane.y + 0.5}
              width={lane.w - 1}
              height={lane.h - 1}
              className="fill-surface/40 stroke-border"
            />
          ))}

          {EDGES.map((edge) => (
            <path
              key={edge.join('-')}
              d={edgePath(edge)}
              fill="none"
              strokeWidth={edgeOn(edge) ? 1.5 : 1}
              markerEnd={edgeOn(edge) ? 'url(#arch-arrow-on)' : 'url(#arch-arrow)'}
              className={`transition-opacity ${edgeOn(edge) ? 'stroke-accent' : 'stroke-muted/60'} ${
                active && !edgeOn(edge) ? 'opacity-25' : ''
              }`}
            />
          ))}

          {/* labels render above the edges on an opaque chip so lines never run through text */}
          {LANES.map((lane) => (
            <g key={lane.label}>
              <rect
                x={lane.x + 8}
                y={lane.y + 7}
                width={lane.label.length * 8 + 10}
                height={15}
                className="fill-bg"
              />
              <text
                x={lane.x + 12}
                y={lane.y + 18}
                fontSize={10}
                letterSpacing="0.2em"
                className="fill-muted font-mono uppercase"
              >
                {lane.label}
              </text>
            </g>
          ))}

          {NODES.map((n) => (
            <g
              key={n.id}
              tabIndex={0}
              onMouseEnter={() => setActive(n.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(n.id)}
              onBlur={() => setActive(null)}
              className={`cursor-default outline-none transition-opacity ${
                linked.has(n.id) ? '' : 'opacity-25'
              }`}
            >
              <title>{n.desc}</title>
              <rect
                x={n.x + 0.5}
                y={n.y + 0.5}
                width={(n.w ?? NODE_W) - 1}
                height={NODE_H - 1}
                className={`fill-bg ${active === n.id ? 'stroke-accent' : 'stroke-border'}`}
              />
              <text
                x={n.x + (n.w ?? NODE_W) / 2}
                y={n.y + NODE_H / 2 + 4}
                textAnchor="middle"
                fontSize={11}
                className={`font-mono ${active === n.id ? 'fill-text' : 'fill-text/85'}`}
              >
                {n.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <p className="mt-3 min-h-10 font-mono text-xs text-muted">
        {active
          ? `> ${NODES.find((n) => n.id === active)!.label}: ${NODES.find((n) => n.id === active)!.desc}`
          : '> hover a component to trace its connections'}
      </p>
    </div>
  );
}
