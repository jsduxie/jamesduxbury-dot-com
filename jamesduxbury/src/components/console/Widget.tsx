'use client';

import { motion, type Variants } from 'framer-motion';
import { SectionHeader } from './SectionHeader';

interface WidgetProps {
  channel: string;
  label: string;
  count?: string | number;
  id?: string;
  className?: string;
  children: React.ReactNode;
}

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

export const Widget: React.FC<WidgetProps> = ({
  channel,
  label,
  count,
  id,
  className,
  children,
}) => (
  <motion.section
    id={id}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-80px' }}
    variants={revealVariants}
    className={`scroll-mt-24 ${className ?? ''}`}
  >
    <SectionHeader channel={channel} label={label} count={count} />
    <div className="border border-border bg-surface/40 backdrop-blur-sm">{children}</div>
  </motion.section>
);
