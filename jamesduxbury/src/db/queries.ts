import { cache } from 'react';
import { getSql } from '@/db';
import type { Project, ProjectMetric, ProjectStatus } from '@/data/projects';
import type { Role } from '@/data/experience';
import type { Degree } from '@/data/education';
import type { Certification } from '@/data/certifications';
import type { SkillGroup } from '@/data/skills';
import type { AboutParagraph } from '@/data/about';
import { siteSettings, type SiteSettings } from '@/data/site';
import type { CaseStudy } from '@/data/case-studies';
import type { ArchitectureSection, ArchitectureSectionKind } from '@/data/architecture';

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

interface SiteSettingsRow {
  profile_image: string;
  contact_email: string;
  github_url: string;
  linkedin_url: string;
  site_version: string;
  owner_name: string;
  tagline: string;
  meta_description: string;
  og_description: string;
  og_footer: string;
  entry_role: string;
  entry_credential: string;
  entry_education: string;
  entry_status: string;
  entry_years: string;
  cv: string | null;
}

// auth-owned read with no fallback: a missing or empty value must fail closed
export const getAdminLogin = cache(async (): Promise<string | null> => {
  const rows = (await getSql()`SELECT admin_login FROM site_settings WHERE id = 1`) as {
    admin_login: string;
  }[];
  const login = rows[0]?.admin_login.trim();
  return login ? login : null;
});

// cache() shares the single settings row across every reader in one request
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const rows = (await getSql()`SELECT * FROM site_settings WHERE id = 1`) as SiteSettingsRow[];
  const r = rows[0];
  if (!r) return siteSettings;
  return {
    profileImage: r.profile_image,
    contactEmail: r.contact_email,
    githubUrl: r.github_url,
    linkedinUrl: r.linkedin_url,
    siteVersion: r.site_version,
    ownerName: r.owner_name,
    tagline: r.tagline,
    metaDescription: r.meta_description,
    ogDescription: r.og_description,
    ogFooter: r.og_footer,
    entryRole: r.entry_role,
    entryCredential: r.entry_credential,
    entryEducation: r.entry_education,
    entryStatus: r.entry_status,
    entryYears: r.entry_years,
    cv: r.cv,
  };
});

export async function getAboutParagraphs(): Promise<AboutParagraph[]> {
  const rows = (await getSql()`SELECT runs FROM about_paragraphs ORDER BY sort_order`) as {
    runs: AboutParagraph;
  }[];
  return rows.map((r) => r.runs);
}

export async function getArchitectureSections(): Promise<ArchitectureSection[]> {
  const rows = (await getSql()`
    SELECT kind, title, body FROM architecture_sections ORDER BY sort_order
  `) as { kind: ArchitectureSectionKind; title: string | null; body: AboutParagraph[] }[];
  return rows.map((r) => ({ kind: r.kind, title: r.title ?? undefined, body: r.body }));
}
