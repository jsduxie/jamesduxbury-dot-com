import { Widget } from '@/components/console/Widget';
import { ArchDiagram } from './ArchDiagram';

const DECISIONS: { title: string; body: string }[] = [
  {
    title: 'no ORM',
    body: 'The schema is ten tables and the queries are straightforward. The Neon driver parameterises every tagged-template value, so the usual injection argument for an ORM does not apply, and the whole data layer stays readable in two files.',
  },
  {
    title: 'a single-user allowlist instead of roles',
    body: 'The site has exactly one editor. Checking my GitHub login by identity at every layer is simpler and stricter than a role system, and there is no user table to manage because sessions are JWTs.',
  },
  {
    title: 'insert-if-missing seed',
    body: 'The seed exists to boot an empty database and nothing else. It inserts with ON CONFLICT DO NOTHING, so running it against a populated database can never overwrite content edited through the console. Tests assert this property.',
  },
  {
    title: 'ISR with revalidation on save',
    body: 'Visitors get statically cached pages; the database is not touched per request. Saving in the admin console revalidates every public route, so edits appear immediately. This gets CDN speed without stale content.',
  },
  {
    title: 'first-party analytics',
    body: 'I want rough visit numbers, not a tracking product. Collecting a per-tab session id and no cookies, IPs or fingerprints keeps the data in my own database and keeps the site free of consent banners.',
  },
  {
    title: 'images in Vercel Blob',
    body: 'Site images are uploaded from the admin console and served from the CDN. Old blobs are deleted when an image is replaced or its row is deleted, so storage stays flat.',
  },
  {
    title: 'no chart library',
    body: 'The analytics dashboard is server-rendered: a div bar chart and an SVG flow diagram. That keeps chart dependencies out and renders without client-side JavaScript.',
  },
];

export function ArchitectureDetail() {
  return (
    <Widget channel="07" label="ARCHITECTURE" id="architecture">
      <div className="space-y-4 px-4 py-6 sm:px-6">
        <p className="text-sm leading-relaxed text-text/85 sm:text-base">
          This site started as a static portfolio and is now a full-stack application. All content
          lives in Postgres and is editable through an authenticated admin console, so the site
          updates without a code push. Visits are tracked first-party and shown on an analytics
          dashboard.
        </p>
        <p className="font-mono text-xs text-muted">
          Next.js 15 · TypeScript · Tailwind CSS · Neon Postgres, raw SQL · next-auth · Vercel
        </p>
      </div>

      <div className="border-t border-border px-4 py-6 sm:px-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">system</h2>
        <div className="mt-4">
          <ArchDiagram />
        </div>
      </div>

      <div className="border-t border-border px-4 py-6 sm:px-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          design decisions
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {DECISIONS.map((d) => (
            <div key={d.title} className="border border-border bg-bg/40 px-4 py-4">
              <h3 className="font-mono text-sm text-accent">{d.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text/85">{d.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border px-4 py-6 sm:px-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          how it was built
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-text/85 sm:text-base">
          The rebuild was planned as GitHub issues grouped into milestones and shipped as small,
          reviewed pull requests. Every change passes the same gate: formatting, lint, typecheck, a
          test suite with enforced coverage thresholds running against a separate Neon branch, and a
          production build. Deployments migrate their target database before building, so schema and
          code always move together.
        </p>
      </div>
    </Widget>
  );
}
