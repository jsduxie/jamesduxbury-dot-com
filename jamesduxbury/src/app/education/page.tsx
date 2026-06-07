import type { Metadata } from 'next';
import { PageShell } from '@/components/PageShell';
import { EducationDetail } from '@/components/education/EducationDetail';
import { getCertifications, getDegrees, getSiteSettings } from '@/db/queries';

export async function generateMetadata(): Promise<Metadata> {
  const [s, degrees, certifications] = await Promise.all([
    getSiteSettings(),
    getDegrees(),
    getCertifications(),
  ]);
  // certs are summarised by count; listing all ten makes an unreadable snippet
  const items = [...degrees.map((d) => d.qualification), `${certifications.length} certifications`];
  return {
    title: `Education · ${s.ownerName}`,
    description: `Education and certifications of ${s.ownerName} — ${items.join(', ')}.`,
  };
}

export const revalidate = 60;

export default function EducationPage() {
  return (
    <PageShell widthClass="max-w-5xl">
      <EducationDetail />
    </PageShell>
  );
}
