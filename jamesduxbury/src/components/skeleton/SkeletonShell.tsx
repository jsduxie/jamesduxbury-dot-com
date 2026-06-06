import { PageShell } from '@/components/PageShell';
import { WidgetFrame } from '@/components/console/WidgetFrame';

interface SkeletonShellProps {
  channel: string;
  label: string;
  ariaLabel: string;
  widthClass: string;
  children: React.ReactNode;
}

export function SkeletonShell({
  channel,
  label,
  ariaLabel,
  widthClass,
  children,
}: SkeletonShellProps) {
  return (
    <PageShell widthClass={widthClass} loadingLabel={ariaLabel}>
      <section>
        <WidgetFrame channel={channel} label={label}>
          {children}
        </WidgetFrame>
      </section>
    </PageShell>
  );
}
