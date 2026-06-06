import { SITE_HOST } from './site';

// Mirrors the console theme in tailwind.config.ts (satori can't read Tailwind).
export const OG_COLOURS = {
  bg: '#0A0A14',
  border: '#2A2A35',
  text: '#F5F5F0',
  muted: '#8B8B95',
  accent: '#3B82F6',
  live: '#22C55E',
};

export const OG_SIZE = { width: 1200, height: 630 };

interface OgFrameProps {
  header: React.ReactNode;
  footerLeft: string;
  children: React.ReactNode;
}

export function OgFrame({ header, footerLeft, children }: OgFrameProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '56px 72px',
        backgroundColor: OG_COLOURS.bg,
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(245, 245, 240, 0.08) 1px, transparent 0)`,
        backgroundSize: '24px 24px',
        color: OG_COLOURS.text,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          fontSize: 26,
          letterSpacing: '0.2em',
          color: OG_COLOURS.muted,
        }}
      >
        <div
          style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: OG_COLOURS.live }}
        />
        {header}
      </div>

      {children}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          borderTop: `2px solid ${OG_COLOURS.border}`,
          paddingTop: '28px',
          fontSize: 24,
          letterSpacing: '0.15em',
          color: OG_COLOURS.muted,
        }}
      >
        <span>{footerLeft}</span>
        <span>{SITE_HOST}</span>
      </div>
    </div>
  );
}
