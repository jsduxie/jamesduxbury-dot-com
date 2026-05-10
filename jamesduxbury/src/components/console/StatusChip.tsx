import React from 'react';

export type StatusKind = 'live' | 'dev' | 'exam' | 'shipped';

const VARIANT: Record<StatusKind, { className: string; dotClass: string; defaultLabel: string }> = {
  live: { className: 'status-chip-live', dotClass: 'bg-live', defaultLabel: 'LIVE' },
  dev: { className: 'status-chip-dev', dotClass: 'bg-dev', defaultLabel: 'IN DEV' },
  exam: { className: 'status-chip-exam', dotClass: 'bg-danger', defaultLabel: 'UNDER EXAM' },
  shipped: { className: 'status-chip-shipped', dotClass: 'bg-accent', defaultLabel: 'SHIPPED' },
};

interface StatusChipProps {
  kind: StatusKind;
  label?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({ kind, label }) => {
  const v = VARIANT[kind];
  return (
    <span className={`status-chip ${v.className}`}>
      <span className={`status-dot ${v.dotClass}`} />
      {label ?? v.defaultLabel}
    </span>
  );
};
