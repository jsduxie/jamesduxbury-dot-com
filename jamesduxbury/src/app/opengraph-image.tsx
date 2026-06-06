import { ImageResponse } from 'next/og';
import { OG_COLOURS, OG_SIZE, OgFrame } from '@/lib/og';

export const alt = 'James Duxbury — Software Engineer in AI and Cybersecurity';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <OgFrame
      header={
        <>
          <span style={{ color: OG_COLOURS.live }}>LIVE</span>
          <span style={{ color: OG_COLOURS.border }}>·</span>
          <span style={{ color: OG_COLOURS.text }}>JAMES DUXBURY</span>
          <span>v2.0</span>
        </>
      }
      footerLeft="MEng Computer Science · Durham"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div style={{ fontSize: 86, fontWeight: 700, letterSpacing: '0.04em' }}>James Duxbury</div>
        <div style={{ fontSize: 36, color: OG_COLOURS.accent, letterSpacing: '0.08em' }}>
          Software Engineer — AI &amp; Cybersecurity
        </div>
      </div>
    </OgFrame>,
    OG_SIZE,
  );
}
