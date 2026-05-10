import React from 'react';

interface SpecRowProps {
  label: string;
  children: React.ReactNode;
  trailing?: React.ReactNode;
}

export const SpecRow: React.FC<SpecRowProps> = ({ label, children, trailing }) => (
  <div className="grid grid-cols-1 gap-1 py-2 sm:grid-cols-[10rem_1fr_auto] sm:items-baseline sm:gap-6 sm:py-1.5">
    <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted sm:text-xs">
      {label}
    </span>
    <span className="text-sm text-text sm:text-base">{children}</span>
    {trailing && <span className="sm:justify-self-end">{trailing}</span>}
  </div>
);
