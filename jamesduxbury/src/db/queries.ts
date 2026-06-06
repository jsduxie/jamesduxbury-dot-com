import { getSql } from '@/db';
import type { Project, ProjectMetric, ProjectStatus } from '@/data/projects';
import type { Role } from '@/data/experience';
import type { Degree } from '@/data/education';
import type { Certification } from '@/data/certifications';
import type { SkillGroup } from '@/data/skills';
import type { AboutParagraph } from '@/data/about';
import { siteSettings, type SiteSettings } from '@/data/site';
import type { CaseStudy } from '@/data/case-studies';

interface ProjectRow {
  slug: string;
  title: string;
  subtitle: string;
  status: ProjectStatus;
  under_exam: boolean;
  year_start: number;
  year_end: number;
  tech_stack: string[];
  highlights: string[];
  metrics: ProjectMetric[] | null;
  image_path: string | null;
  github_link: string | null;
  live_link: string | null;
}

interface RoleRow {
  title: string;
  organisation: string;
  meta: string | null;
  period: string;
  year_start: number;
  year_end: number | null;
  bullets: string[] | null;
}

interface DegreeRow {
  qualification: string;
  institution: string;
  period: string;
  year_end: number;
  bullets: string[] | null;
}

interface CertificationRow {
  name: string;
  year: string;
  img_path: string | null;
  certification_link: string | null;
}

export async function getProjects(): Promise<Project[]> {
  const rows = (await getSql()`SELECT * FROM projects ORDER BY sort_order`) as ProjectRow[];
  return rows.map((r) => ({
    slug: r.slug,
    title: r.title,
    subtitle: r.subtitle,
    status: r.status,
    underExam: r.under_exam,
    yearStart: r.year_start,
    yearEnd: r.year_end,
    techStack: r.tech_stack,
    highlights: r.highlights,
    metrics: r.metrics ?? undefined,
    imagePath: r.image_path ?? undefined,
    githubLink: r.github_link ?? undefined,
    liveLink: r.live_link ?? undefined,
  }));
}

export async function getRoles(): Promise<Role[]> {
  const rows = (await getSql()`SELECT * FROM experience ORDER BY sort_order`) as RoleRow[];
  return rows.map((r) => ({
    title: r.title,
    organisation: r.organisation,
    meta: r.meta ?? undefined,
    period: r.period,
    yearStart: r.year_start,
    yearEnd: r.year_end ?? 'present',
    bullets: r.bullets ?? undefined,
  }));
}

export async function getDegrees(): Promise<Degree[]> {
  const rows = (await getSql()`SELECT * FROM education ORDER BY sort_order`) as DegreeRow[];
  return rows.map((r) => ({
    qualification: r.qualification,
    institution: r.institution,
    period: r.period,
    yearEnd: r.year_end,
    bullets: r.bullets ?? undefined,
  }));
}

export async function getCertifications(): Promise<Certification[]> {
  const rows =
    (await getSql()`SELECT * FROM certifications ORDER BY sort_order`) as CertificationRow[];
  return rows.map((r) => ({
    name: r.name,
    year: r.year,
    imgPath: r.img_path ?? undefined,
    certificationLink: r.certification_link ?? undefined,
  }));
}

export async function getSkillGroups(): Promise<SkillGroup[]> {
  const rows = (await getSql()`SELECT * FROM skill_groups ORDER BY sort_order`) as SkillGroup[];
  return rows.map((r) => ({ heading: r.heading, skills: r.skills }));
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) ?? null;
}

interface CaseStudyRow {
  project_slug: string;
  problem: AboutParagraph[];
  approach: AboutParagraph[];
  outcome: AboutParagraph[] | null;
  image_path: string | null;
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  const rows = (await getSql()`
    SELECT project_slug, problem, approach, outcome, image_path
    FROM case_studies WHERE project_slug = ${slug}
  `) as CaseStudyRow[];
  const r = rows[0];
  if (!r) return null;
  return {
    projectSlug: r.project_slug,
    problem: r.problem,
    approach: r.approach,
    outcome: r.outcome ?? undefined,
    imagePath: r.image_path ?? undefined,
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const rows = (await getSql()`SELECT profile_image FROM site_settings WHERE id = 1`) as {
    profile_image: string;
  }[];
  return { profileImage: rows[0]?.profile_image ?? siteSettings.profileImage };
}

export async function getAboutParagraphs(): Promise<AboutParagraph[]> {
  const rows = (await getSql()`SELECT runs FROM about_paragraphs ORDER BY sort_order`) as {
    runs: AboutParagraph;
  }[];
  return rows.map((r) => r.runs);
}
