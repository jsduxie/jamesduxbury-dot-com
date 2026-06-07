import { PageShell } from '@/components/PageShell';
import { FooterContent } from '@/components/Footer';
import { WidgetFrame } from '@/components/console/WidgetFrame';
import { siteSettings } from '@/data/site';

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
    <PageShell
      widthClass={widthClass}
      loadingLabel={ariaLabel}
      footer={<FooterContent settings={siteSettings} />}
    >
      <section>
        <WidgetFrame channel={channel} label={label}>
          {children}
        </WidgetFrame>
      </section>
    </PageShell>
  );
}
