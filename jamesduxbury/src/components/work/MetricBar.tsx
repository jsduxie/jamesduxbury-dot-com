import type { ProjectMetric } from '@/data/projects';

interface MetricBarProps {
  metrics: ProjectMetric[];
}

export const MetricBar: React.FC<MetricBarProps> = ({ metrics }) => (
  <div className="space-y-2 border-t border-border bg-bg/40 px-4 py-4 sm:px-6">
    <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">Metrics</p>
    <div className="grid gap-2 sm:grid-cols-2">
      {metrics.map((m) => (
        <div key={m.label} className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
          <span className="font-mono text-xs text-muted">{m.label}</span>
          <span className="relative h-1.5 overflow-hidden rounded-sm bg-border">
            {m.ratio !== undefined && (
              <span
                className="absolute inset-y-0 left-0 bg-accent"
                style={{ width: `${Math.min(Math.max(m.ratio, 0), 1) * 100}%` }}
                aria-hidden
              />
            )}
          </span>
          <span className="font-mono text-xs text-text">{m.value}</span>
        </div>
      ))}
    </div>
  </div>
);
