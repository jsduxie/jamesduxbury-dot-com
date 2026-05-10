import React from 'react';

interface SectionHeaderProps {
  channel: string;
  label: string;
  count?: string | number;
  id?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ channel, label, count, id }) => (
  <div id={id} className="mb-8 flex items-center gap-4">
    <span className="font-mono text-sm uppercase tracking-[0.2em] text-muted">
      CHANNEL {channel}
    </span>
    <span className="text-muted">—</span>
    <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-text">{label}</h2>
    {count !== undefined && (
      <span className="font-mono text-sm uppercase tracking-[0.2em] text-muted">/ {count}</span>
    )}
    <span aria-hidden className="ml-2 hidden h-px flex-1 bg-border md:block" />
  </div>
);
