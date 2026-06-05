import { neon } from '@neondatabase/serverless';
import { loadEnvLocal } from '../src/db/env';
import { projects } from '../src/data/projects';
import { roles } from '../src/data/experience';
import { degrees } from '../src/data/education';
import { certifications } from '../src/data/certifications';
import { skillGroups } from '../src/data/skills';
import { aboutParagraphs } from '../src/data/about';

async function main(): Promise<void> {
  loadEnvLocal();
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL is not set (env or .env.local).');
    process.exit(1);
  }
  const sql = neon(url);

  for (const [i, p] of projects.entries()) {
    await sql`
      INSERT INTO projects (slug, title, subtitle, status, under_exam, year_start, year_end,
        tech_stack, highlights, metrics, image_path, github_link, live_link, sort_order)
      VALUES (${p.slug}, ${p.title}, ${p.subtitle}, ${p.status}, ${p.underExam ?? false},
        ${p.yearStart}, ${p.yearEnd}, ${p.techStack}, ${p.highlights},
        ${p.metrics ? JSON.stringify(p.metrics) : null}, ${p.imagePath ?? null},
        ${p.githubLink ?? null}, ${p.liveLink ?? null}, ${i})
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, status = EXCLUDED.status,
        under_exam = EXCLUDED.under_exam, year_start = EXCLUDED.year_start,
        year_end = EXCLUDED.year_end, tech_stack = EXCLUDED.tech_stack,
        highlights = EXCLUDED.highlights, metrics = EXCLUDED.metrics,
        image_path = EXCLUDED.image_path, github_link = EXCLUDED.github_link,
        live_link = EXCLUDED.live_link, sort_order = EXCLUDED.sort_order, updated_at = now()
    `;
  }

  for (const [i, r] of roles.entries()) {
    await sql`
      INSERT INTO experience (title, organisation, meta, period, year_start, year_end, bullets, sort_order)
      VALUES (${r.title}, ${r.organisation}, ${r.meta ?? null}, ${r.period}, ${r.yearStart},
        ${r.yearEnd === 'present' ? null : r.yearEnd}, ${r.bullets ?? null}, ${i})
      ON CONFLICT (title, organisation) DO UPDATE SET
        meta = EXCLUDED.meta, period = EXCLUDED.period, year_start = EXCLUDED.year_start,
        year_end = EXCLUDED.year_end, bullets = EXCLUDED.bullets,
        sort_order = EXCLUDED.sort_order, updated_at = now()
    `;
  }

  for (const [i, d] of degrees.entries()) {
    await sql`
      INSERT INTO education (qualification, institution, period, year_end, bullets, sort_order)
      VALUES (${d.qualification}, ${d.institution}, ${d.period}, ${d.yearEnd}, ${d.bullets ?? null}, ${i})
      ON CONFLICT (qualification, institution) DO UPDATE SET
        period = EXCLUDED.period, year_end = EXCLUDED.year_end, bullets = EXCLUDED.bullets,
        sort_order = EXCLUDED.sort_order, updated_at = now()
    `;
  }

  for (const [i, c] of certifications.entries()) {
    await sql`
      INSERT INTO certifications (name, year, img_path, certification_link, sort_order)
      VALUES (${c.name}, ${c.year}, ${c.imgPath ?? null}, ${c.certificationLink ?? null}, ${i})
      ON CONFLICT (name) DO UPDATE SET
        year = EXCLUDED.year, img_path = EXCLUDED.img_path,
        certification_link = EXCLUDED.certification_link,
        sort_order = EXCLUDED.sort_order, updated_at = now()
    `;
  }

  for (const [i, g] of skillGroups.entries()) {
    await sql`
      INSERT INTO skill_groups (heading, skills, sort_order)
      VALUES (${g.heading}, ${g.skills}, ${i})
      ON CONFLICT (heading) DO UPDATE SET
        skills = EXCLUDED.skills, sort_order = EXCLUDED.sort_order, updated_at = now()
    `;
  }

  for (const [i, runs] of aboutParagraphs.entries()) {
    await sql`
      INSERT INTO about_paragraphs (runs, sort_order)
      VALUES (${JSON.stringify(runs)}, ${i})
      ON CONFLICT (sort_order) DO UPDATE SET runs = EXCLUDED.runs, updated_at = now()
    `;
  }

  const counts = await sql`
    SELECT
      (SELECT count(*) FROM projects) AS projects,
      (SELECT count(*) FROM experience) AS experience,
      (SELECT count(*) FROM education) AS education,
      (SELECT count(*) FROM certifications) AS certifications,
      (SELECT count(*) FROM skill_groups) AS skill_groups,
      (SELECT count(*) FROM about_paragraphs) AS about_paragraphs
  `;
  console.log('seeded:', counts[0]);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
