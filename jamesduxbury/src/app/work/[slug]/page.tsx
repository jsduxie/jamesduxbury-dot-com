import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageShell } from '@/components/PageShell';
import { CaseStudyDetail } from '@/components/work/CaseStudyDetail';
import { getCaseStudy, getProjectBySlug, getProjects } from '@/db/queries';

export const revalidate = 60;

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title} · James Duxbury`,
    description: project.subtitle,
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();
  const study = await getCaseStudy(slug);

  return (
    <PageShell widthClass="max-w-4xl" backHref="/work" backLabel="/ work">
      <CaseStudyDetail project={project} study={study} />
    </PageShell>
  );
}
