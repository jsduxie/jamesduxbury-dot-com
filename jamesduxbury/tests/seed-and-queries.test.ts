import { neon } from '@neondatabase/serverless';
import { describe, expect, it } from 'vitest';
import { seed } from '../src/db/seed';
import {
  getAboutParagraphs,
  getCertifications,
  getDegrees,
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
import { siteSettings } from '../src/data/site';

const sql = neon(process.env.DATABASE_URL!);

describe('seed', () => {
  it('is idempotent: two runs leave identical counts', async () => {
    const first = await seed(sql);
    const second = await seed(sql);
    expect(second).toEqual(first);
    expect(first).toEqual({
      projects: String(projects.length),
      experience: String(roles.length),
      education: String(degrees.length),
      certifications: String(certifications.length),
      skill_groups: String(skillGroups.length),
      about_paragraphs: String(aboutParagraphs.length),
      site_settings: '1',
    });
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
    expect(await getProjects()).toEqual(
      projects.map((p) => ({ ...p, underExam: p.underExam ?? false })),
    );
  });

  it('roles, including present-role mapping', async () => {
    expect(await getRoles()).toEqual(roles);
  });

  it('degrees', async () => {
    expect(await getDegrees()).toEqual(degrees);
  });

  it('certifications', async () => {
    expect(await getCertifications()).toEqual(certifications);
  });

  it('skill groups', async () => {
    expect(await getSkillGroups()).toEqual(skillGroups);
  });

  it('about paragraphs', async () => {
    expect(await getAboutParagraphs()).toEqual(aboutParagraphs);
  });

  it('site settings', async () => {
    expect(await getSiteSettings()).toEqual(siteSettings);
  });
});
