'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface CollapsibleRowProps {
  header: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onToggle?: () => void;
  children: React.ReactNode;
}

export const CollapsibleRow: React.FC<CollapsibleRowProps> = ({
  header,
  defaultOpen = false,
  open: controlledOpen,
  onToggle,
  children,
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const toggle = () => {
    if (isControlled) {
      onToggle?.();
    } else {
      setInternalOpen((v) => !v);
    }
  };

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-bg/40 sm:px-6"
      >
        <span
          aria-hidden
          className={`font-mono text-xs text-muted transition-transform ${open ? 'rotate-90 text-accent' : ''}`}
        >
          ▸
        </span>
        <div className="flex-1">{header}</div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 pt-1 sm:px-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
