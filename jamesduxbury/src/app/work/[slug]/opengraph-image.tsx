import { ImageResponse } from 'next/og';
import { getProjectBySlug } from '@/db/queries';
import { SITE_HOST } from '@/lib/site';

export const alt = 'Case study · James Duxbury';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Mirrors the console theme in tailwind.config.ts (satori can't read Tailwind).
const colours = {
  bg: '#0A0A14',
  border: '#2A2A35',
  text: '#F5F5F0',
  muted: '#8B8B95',
  accent: '#3B82F6',
  live: '#22C55E',
};

export default async function OpenGraphImage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  const title = project?.title ?? 'Case study';
  const subtitle = project?.subtitle ?? '';
  const yearLabel = project
    ? project.yearEnd === project.yearStart
      ? `${project.yearStart}`
      : `${project.yearStart} — ${project.yearEnd}`
    : '';
  const status = (project?.status ?? 'live').toUpperCase();

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '56px 72px',
        backgroundColor: colours.bg,
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(245, 245, 240, 0.08) 1px, transparent 0)`,
        backgroundSize: '24px 24px',
        color: colours.text,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          fontSize: 26,
          letterSpacing: '0.2em',
          color: colours.muted,
        }}
      >
        <div
          style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: colours.live }}
        />
        <span style={{ color: colours.live }}>{status}</span>
        <span style={{ color: colours.border }}>·</span>
        <span style={{ color: colours.text }}>CASE STUDY</span>
        <span>{yearLabel}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div style={{ fontSize: 78, fontWeight: 700, letterSpacing: '0.04em' }}>{title}</div>
        <div style={{ fontSize: 34, color: colours.accent, letterSpacing: '0.08em' }}>
          {subtitle}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          borderTop: `2px solid ${colours.border}`,
          paddingTop: '28px',
          fontSize: 24,
          letterSpacing: '0.15em',
          color: colours.muted,
        }}
      >
        <span>James Duxbury</span>
        <span>{SITE_HOST}</span>
      </div>
    </div>,
    size,
  );
}
