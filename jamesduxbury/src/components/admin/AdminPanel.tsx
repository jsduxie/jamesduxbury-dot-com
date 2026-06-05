interface AdminPanelProps {
  title: string;
  meta?: string;
  children: React.ReactNode;
}

export function AdminPanel({ title, meta, children }: AdminPanelProps) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          {`>`} {title}
        </h2>
        {meta && <span className="font-mono text-[0.65rem] text-muted/70">{meta}</span>}
      </div>
      <div className="border border-border bg-surface/40 backdrop-blur-sm">{children}</div>
    </section>
  );
}
