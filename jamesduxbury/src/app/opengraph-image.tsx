import { ImageResponse } from 'next/og';
import { getSiteSettings } from '@/db/queries';
import { OG_COLOURS, OG_SIZE, OgFrame } from '@/lib/og';

// alt must be a static export; the card body below is settings-driven
export const alt = 'James Duxbury — Software Engineer in AI and Cybersecurity';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  const settings = await getSiteSettings();
  return new ImageResponse(
    <OgFrame
      header={
        <>
          <span style={{ color: OG_COLOURS.live }}>LIVE</span>
          <span style={{ color: OG_COLOURS.border }}>·</span>
          <span style={{ color: OG_COLOURS.text }}>{settings.ownerName.toUpperCase()}</span>
          <span>{settings.siteVersion}</span>
        </>
      }
      footerLeft={settings.ogFooter}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div style={{ fontSize: 86, fontWeight: 700, letterSpacing: '0.04em' }}>
          {settings.ownerName}
        </div>
        <div style={{ fontSize: 36, color: OG_COLOURS.accent, letterSpacing: '0.08em' }}>
          {settings.tagline}
        </div>
      </div>
    </OgFrame>,
    OG_SIZE,
  );
}
