import { ImageResponse } from 'next/og';
import { formatYearRange } from '@/data/projects';
import { getProjectBySlug, getSiteSettings } from '@/db/queries';
import { OG_COLOURS, OG_SIZE, OgFrame } from '@/lib/og';

export const alt = 'Case study · James Duxbury';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, settings] = await Promise.all([getProjectBySlug(slug), getSiteSettings()]);
  const title = project?.title ?? 'Case study';
  const subtitle = project?.subtitle ?? '';
  const yearLabel = project ? formatYearRange(project) : '';
  const status = (project?.status ?? 'live').toUpperCase();

  return new ImageResponse(
    <OgFrame
      header={
        <>
          <span style={{ color: OG_COLOURS.live }}>{status}</span>
          <span style={{ color: OG_COLOURS.border }}>·</span>
          <span style={{ color: OG_COLOURS.text }}>CASE STUDY</span>
          <span>{yearLabel}</span>
        </>
      }
      footerLeft={settings.ownerName}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div style={{ fontSize: 78, fontWeight: 700, letterSpacing: '0.04em' }}>{title}</div>
        <div style={{ fontSize: 34, color: OG_COLOURS.accent, letterSpacing: '0.08em' }}>
          {subtitle}
        </div>
      </div>
    </OgFrame>,
    OG_SIZE,
  );
}
