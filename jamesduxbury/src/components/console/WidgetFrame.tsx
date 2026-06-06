import { SectionHeader } from './SectionHeader';

interface WidgetFrameProps {
  channel: string;
  label: string;
  count?: string | number;
  children: React.ReactNode;
}

// static widget frame shared by Widget and the loading skeletons so they cannot drift
export function WidgetFrame({ channel, label, count, children }: WidgetFrameProps) {
  return (
    <>
      <SectionHeader channel={channel} label={label} count={count} />
      <div className="border border-border bg-surface/40 backdrop-blur-sm">{children}</div>
    </>
  );
}
