import { neon } from '@neondatabase/serverless';
import { describe, expect, it } from 'vitest';
import { seed } from '../src/db/seed';
import {
  getAboutParagraphs,
  getCaseStudy,
  getCertifications,
  getDegrees,
  getProjectBySlug,
  getProjects,
  getRoles,
  getSiteSettings,
  getSkillGroups,
} from '../src/db/queries';
import { projects } from '../src/data/projects';
import { roles } from '../src/data/experience';
import { degrees } from '../src/data/education';
import { certifications } from '../src/data/certifications';
import { skillGroups } from '../src/data/skills';
import { aboutParagraphs } from '../src/data/about';
import { caseStudies } from '../src/data/case-studies';
import { siteSettings } from '../src/data/site';

const sql = neon(process.env.DATABASE_URL!);

describe('seed', () => {
  // counts compare run-to-run, not to absolute sizes: other branches seed rows into the shared dev DB
  it('is idempotent: two runs leave identical counts', async () => {
    const first = await seed(sql);
    const second = await seed(sql);
    expect(second).toEqual(first);
    expect(Number(first.projects)).toBeGreaterThanOrEqual(projects.length);
    expect(Number(first.case_studies)).toBeGreaterThanOrEqual(caseStudies.length);
    expect(first.site_settings).toBe('1');
  });

  it('does not overwrite existing rows', async () => {
    await sql`UPDATE projects SET subtitle = 'edited via admin' WHERE slug = ${projects[0].slug}`;
    await seed(sql);
    const [row] = await sql`SELECT subtitle FROM projects WHERE slug = ${projects[0].slug}`;
    expect(row.subtitle).toBe('edited via admin');
    await sql`UPDATE projects SET subtitle = ${projects[0].subtitle} WHERE slug = ${projects[0].slug}`;
  });
});

describe('queries round-trip the seeded src/data shapes exactly', () => {
  it('projects', async () => {
    const bySlug = new Map((await getProjects()).map((p) => [p.slug, p]));
    for (const p of projects) {
      expect(bySlug.get(p.slug)).toEqual({ ...p, underExam: p.underExam ?? false });
    }
  });

  it('roles, including present-role mapping', async () => {
    const byKey = new Map((await getRoles()).map((r) => [`${r.title}|${r.organisation}`, r]));
    for (const r of roles) expect(byKey.get(`${r.title}|${r.organisation}`)).toEqual(r);
  });

  it('degrees', async () => {
    const byKey = new Map((await getDegrees()).map((d) => [d.qualification, d]));
    for (const d of degrees) expect(byKey.get(d.qualification)).toEqual(d);
  });

  it('certifications', async () => {
    const byName = new Map((await getCertifications()).map((c) => [c.name, c]));
    for (const c of certifications) expect(byName.get(c.name)).toEqual(c);
  });

  it('skill groups', async () => {
    const byHeading = new Map((await getSkillGroups()).map((g) => [g.heading, g]));
    for (const g of skillGroups) expect(byHeading.get(g.heading)).toEqual(g);
  });

  it('about paragraphs', async () => {
    expect(await getAboutParagraphs()).toEqual(aboutParagraphs);
  });

  it('site settings', async () => {
    expect(await getSiteSettings()).toEqual(siteSettings);
  });

  it('case studies', async () => {
    for (const cs of caseStudies) {
      expect(await getCaseStudy(cs.projectSlug)).toEqual(cs);
    }
    expect(await getCaseStudy('no-such-slug')).toBeNull();
  });

  it('project lookup by slug', async () => {
    const p = projects[0];
    expect(await getProjectBySlug(p.slug)).toEqual({ ...p, underExam: p.underExam ?? false });
    expect(await getProjectBySlug('no-such-slug')).toBeNull();
  });
});
