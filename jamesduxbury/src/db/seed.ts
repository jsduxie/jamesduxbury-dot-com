import type { NeonQueryFunction } from '@neondatabase/serverless';
import { projects } from '@/data/projects';
import { roles } from '@/data/experience';
import { degrees } from '@/data/education';
import { certifications } from '@/data/certifications';
import { skillGroups } from '@/data/skills';
import { aboutParagraphs } from '@/data/about';
import { siteSettings } from '@/data/site';
import { caseStudies } from '@/data/case-studies';

// Insert-if-missing only: reseeding must never overwrite admin edits
export async function seed(sql: NeonQueryFunction<false, false>): Promise<Record<string, string>> {
  for (const [i, p] of projects.entries()) {
    await sql`
      INSERT INTO projects (slug, title, subtitle, status, under_exam, year_start, year_end,
        tech_stack, highlights, metrics, image_path, github_link, live_link, sort_order)
      VALUES (${p.slug}, ${p.title}, ${p.subtitle}, ${p.status}, ${p.underExam ?? false},
        ${p.yearStart}, ${p.yearEnd}, ${p.techStack}, ${p.highlights},
        ${p.metrics ? JSON.stringify(p.metrics) : null}, ${p.imagePath ?? null},
        ${p.githubLink ?? null}, ${p.liveLink ?? null}, ${i})
      ON CONFLICT (slug) DO NOTHING
    `;
  }

  for (const [i, r] of roles.entries()) {
    await sql`
      INSERT INTO experience (title, organisation, meta, period, year_start, year_end, bullets, sort_order)
      VALUES (${r.title}, ${r.organisation}, ${r.meta ?? null}, ${r.period}, ${r.yearStart},
        ${r.yearEnd === 'present' ? null : r.yearEnd}, ${r.bullets ?? null}, ${i})
      ON CONFLICT (title, organisation) DO NOTHING
    `;
  }

  for (const [i, d] of degrees.entries()) {
    await sql`
      INSERT INTO education (qualification, institution, period, year_end, bullets, sort_order)
      VALUES (${d.qualification}, ${d.institution}, ${d.period}, ${d.yearEnd}, ${d.bullets ?? null}, ${i})
      ON CONFLICT (qualification, institution) DO NOTHING
    `;
  }

  for (const [i, c] of certifications.entries()) {
    await sql`
      INSERT INTO certifications (name, year, img_path, certification_link, sort_order)
      VALUES (${c.name}, ${c.year}, ${c.imgPath ?? null}, ${c.certificationLink ?? null}, ${i})
      ON CONFLICT (name) DO NOTHING
    `;
  }

  for (const [i, g] of skillGroups.entries()) {
    await sql`
      INSERT INTO skill_groups (heading, skills, sort_order)
      VALUES (${g.heading}, ${g.skills}, ${i})
      ON CONFLICT (heading) DO NOTHING
    `;
  }

  for (const [i, runs] of aboutParagraphs.entries()) {
    await sql`
      INSERT INTO about_paragraphs (runs, sort_order)
      VALUES (${JSON.stringify(runs)}, ${i})
      ON CONFLICT (sort_order) DO NOTHING
    `;
  }

  for (const [i, cs] of caseStudies.entries()) {
    await sql`
      INSERT INTO case_studies (project_slug, problem, approach, outcome, image_path, sort_order)
      VALUES (${cs.projectSlug}, ${JSON.stringify(cs.problem)}, ${JSON.stringify(cs.approach)},
        ${cs.outcome ? JSON.stringify(cs.outcome) : null}, ${cs.imagePath ?? null}, ${i})
      ON CONFLICT (project_slug) DO NOTHING
    `;
  }

  await sql`
    INSERT INTO site_settings (profile_image)
    VALUES (${siteSettings.profileImage})
    ON CONFLICT (id) DO NOTHING
  `;

  const counts = (await sql`
    SELECT
      (SELECT count(*) FROM projects) AS projects,
      (SELECT count(*) FROM experience) AS experience,
      (SELECT count(*) FROM education) AS education,
      (SELECT count(*) FROM certifications) AS certifications,
      (SELECT count(*) FROM skill_groups) AS skill_groups,
      (SELECT count(*) FROM about_paragraphs) AS about_paragraphs,
      (SELECT count(*) FROM case_studies) AS case_studies,
      (SELECT count(*) FROM site_settings) AS site_settings
  `) as Record<string, string>[];
  return counts[0];
}
