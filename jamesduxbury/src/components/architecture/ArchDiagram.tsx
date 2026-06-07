const lane = 'border border-border bg-surface/40 px-4 py-4 backdrop-blur-sm sm:px-6';
const laneLabel = 'font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted';
const box = 'border border-border bg-bg px-3 py-2 font-mono text-xs text-text/85 whitespace-nowrap';
const arrow = 'py-1 text-center font-mono text-sm text-accent';

function Lane({ label, items }: { label: string; items: string[] }) {
  return (
    <div className={lane}>
      <p className={laneLabel}>{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className={box}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ArchDiagram() {
  return (
    <div>
      <Lane label="visitor browser" items={['public pages', 'visit beacon', 'contact form']} />
      <p className={arrow} aria-hidden>
        ↓
      </p>
      <Lane
        label="next.js on vercel"
        items={[
          'public routes · ISR',
          '/api/visit',
          '/api/contact',
          'admin console',
          'server actions',
          'next-auth',
        ]}
      />
      <p className={arrow} aria-hidden>
        ↓
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Lane
          label="neon postgres"
          items={['content tables', 'page_views', 'messages', 'case_studies']}
        />
        <Lane label="external" items={['vercel blob', 'github oauth', 'email']} />
      </div>
      <p className={arrow} aria-hidden>
        ↓
      </p>
      <Lane
        label="ci and deployment"
        items={[
          'github actions: format, lint, typecheck, test',
          'vercel build: migrate, then next build',
        ]}
      />
    </div>
  );
}
