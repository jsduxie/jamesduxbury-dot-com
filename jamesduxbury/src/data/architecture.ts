import type { AboutParagraph } from './about';

export type ArchitectureSectionKind = 'intro' | 'stack' | 'decision' | 'build';

export interface ArchitectureSection {
  kind: ArchitectureSectionKind;
  title?: string;
  body: AboutParagraph[];
}

export const architectureSections: ArchitectureSection[] = [
  {
    kind: 'intro',
    body: [
      [
        'This site started as a static portfolio and is now a full-stack application. All content lives in Postgres and is editable through an authenticated admin console, so the site updates without a code push. Visits are tracked first-party and shown on an analytics dashboard.',
      ],
    ],
  },
  {
    kind: 'stack',
    body: [
      ['Next.js 15 · TypeScript · Tailwind CSS · Neon Postgres, raw SQL · next-auth · Vercel'],
    ],
  },
  {
    kind: 'decision',
    title: 'no ORM',
    body: [
      [
        'The schema is eleven tables and the queries are straightforward. The Neon driver parameterises every tagged-template value, so the usual injection argument for an ORM does not apply, and the whole data layer stays readable in two files. Working directly with SQL was also part of the point of the project.',
      ],
    ],
  },
  {
    kind: 'decision',
    title: 'a single-user allowlist instead of roles',
    body: [
      [
        'The site has exactly one editor. Checking my GitHub login by identity at every layer is simpler and stricter than a role system, and there is no user table to manage because sessions are JWTs.',
      ],
    ],
  },
  {
    kind: 'decision',
    title: 'insert-if-missing seed',
    body: [
      [
        'The seed exists to boot an empty database and nothing else. It inserts with ON CONFLICT DO NOTHING, so running it against a populated database can never overwrite content edited through the console. Tests assert this property.',
      ],
    ],
  },
  {
    kind: 'decision',
    title: 'ISR with revalidation on save',
    body: [
      [
        'Visitors get statically cached pages; the database is not touched per request. Saving in the admin console revalidates every public route, so edits appear immediately. This gets CDN speed without stale content.',
      ],
    ],
  },
  {
    kind: 'decision',
    title: 'first-party analytics',
    body: [
      [
        'I want rough visit numbers, not a tracking product. Collecting a per-tab session id and no cookies, IPs or fingerprints keeps the data in my own database and keeps the site free of consent banners.',
      ],
    ],
  },
  {
    kind: 'decision',
    title: 'images in Vercel Blob',
    body: [
      [
        'The images are a few megabytes in total, so almost anything would work. I evaluated Cloudflare R2 and Postgres bytea behind a cached route handler; Blob won because it needs no extra account or dependency and serves straight from the CDN. Old blobs are deleted when an image is replaced, so storage stays flat.',
      ],
    ],
  },
  {
    kind: 'decision',
    title: 'no chart library',
    body: [
      [
        'The dashboard chart is a server-rendered bar chart built from divs. It is one dependency fewer and renders without client-side JavaScript.',
      ],
    ],
  },
  {
    kind: 'build',
    body: [
      [
        'The rebuild was planned as GitHub issues grouped into milestones and shipped as small, reviewed pull requests. Every change passes the same gate: formatting, lint, typecheck, a test suite with enforced coverage thresholds running against a separate Neon branch, and a production build. Deployments migrate their target database before building, so schema and code always move together.',
      ],
    ],
  },
];
