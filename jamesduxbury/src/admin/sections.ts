import { z } from 'zod';
import type { FieldDef } from './fields';

export interface SectionConfig {
  slug: string;
  table: string;
  title: string;
  fields: FieldDef[];
  schema: z.ZodType<Record<string, unknown>>;
  listLabel: (row: Record<string, unknown>) => string;
}

const sortOrder = z.number().int().min(0);
const year = z.number().int().min(1900).max(2100);
const optionalUrl = z.url().nullable();
// stores NULL rather than an empty array for nullable text array columns
const optionalBullets = z
  .array(z.string().min(1))
  .transform((lines) => (lines.length ? lines : null));

const imageField = (column: string): FieldDef => ({
  column,
  label: 'Image',
  type: 'image',
  help: 'png, jpeg or webp up to 4MB; empty keeps the current image',
});

const metricSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  ratio: z.number().min(0).max(1).optional(),
});

const runSchema = z.union([
  z.string().min(1),
  z.object({ strong: z.string().min(1) }),
  z.object({ em: z.string().min(1) }),
]);

export const SECTIONS: SectionConfig[] = [
  {
    slug: 'projects',
    table: 'projects',
    title: 'Projects',
    fields: [
      { column: 'title', label: 'Title', type: 'text' },
      { column: 'slug', label: 'Slug', type: 'text', help: 'lowercase letters, digits, hyphens' },
      { column: 'subtitle', label: 'Subtitle', type: 'text' },
      {
        column: 'status',
        label: 'Status',
        type: 'select',
        options: ['live', 'dev', 'exam', 'shipped'],
      },
      { column: 'under_exam', label: 'Under exam', type: 'checkbox' },
      { column: 'year_start', label: 'Year start', type: 'number' },
      { column: 'year_end', label: 'Year end', type: 'number' },
      { column: 'tech_stack', label: 'Tech stack', type: 'tags', help: 'comma-separated' },
      { column: 'highlights', label: 'Highlights', type: 'bullets' },
      {
        column: 'metrics',
        label: 'Metrics',
        type: 'metrics',
        help: 'ratio is the 0–1 bar fill, optional — remove all rows for none',
      },
      imageField('image_path'),
      { column: 'github_link', label: 'GitHub link', type: 'url' },
      { column: 'live_link', label: 'Live link', type: 'url' },
      { column: 'sort_order', label: 'Sort order', type: 'sort_order' },
    ],
    schema: z.object({
      title: z.string().min(1),
      slug: z.string().regex(/^[a-z0-9-]+$/, 'lowercase letters, digits, and hyphens only'),
      subtitle: z.string().min(1),
      status: z.enum(['live', 'dev', 'exam', 'shipped']),
      under_exam: z.boolean(),
      year_start: year,
      year_end: year,
      tech_stack: z.array(z.string().min(1)).min(1),
      highlights: z.array(z.string().min(1)).min(1),
      metrics: z.array(metricSchema).min(1).nullable(),
      image_path: z.string().min(1).nullable(),
      github_link: optionalUrl,
      live_link: optionalUrl,
      sort_order: sortOrder,
    }),
    listLabel: (row) => String(row.title),
  },
  {
    slug: 'experience',
    table: 'experience',
    title: 'Experience',
    fields: [
      { column: 'title', label: 'Title', type: 'text' },
      { column: 'organisation', label: 'Organisation', type: 'text' },
      { column: 'meta', label: 'Meta', type: 'text', help: 'optional, e.g. team or location' },
      {
        column: 'period',
        label: 'Period',
        type: 'text',
        help: 'display text, e.g. Jun – Sep 2025',
      },
      { column: 'year_start', label: 'Year start', type: 'number' },
      { column: 'year_end', label: 'Year end', type: 'number', help: 'leave empty for present' },
      { column: 'bullets', label: 'Bullets', type: 'bullets' },
      { column: 'sort_order', label: 'Sort order', type: 'sort_order' },
    ],
    schema: z.object({
      title: z.string().min(1),
      organisation: z.string().min(1),
      meta: z.string().min(1).nullable(),
      period: z.string().min(1),
      year_start: year,
      year_end: year.nullable(),
      bullets: optionalBullets,
      sort_order: sortOrder,
    }),
    listLabel: (row) => `${String(row.title)} · ${String(row.organisation)}`,
  },
  {
    slug: 'education',
    table: 'education',
    title: 'Education',
    fields: [
      { column: 'qualification', label: 'Qualification', type: 'text' },
      { column: 'institution', label: 'Institution', type: 'text' },
      { column: 'period', label: 'Period', type: 'text' },
      { column: 'year_end', label: 'Year end', type: 'number' },
      { column: 'bullets', label: 'Bullets', type: 'bullets' },
      { column: 'sort_order', label: 'Sort order', type: 'sort_order' },
    ],
    schema: z.object({
      qualification: z.string().min(1),
      institution: z.string().min(1),
      period: z.string().min(1),
      year_end: year,
      bullets: optionalBullets,
      sort_order: sortOrder,
    }),
    listLabel: (row) => String(row.qualification),
  },
  {
    slug: 'certifications',
    table: 'certifications',
    title: 'Certifications',
    fields: [
      { column: 'name', label: 'Name', type: 'text' },
      { column: 'year', label: 'Year', type: 'text', help: 'display text, e.g. 2024' },
      imageField('img_path'),
      { column: 'certification_link', label: 'Certification link', type: 'url' },
      { column: 'sort_order', label: 'Sort order', type: 'sort_order' },
    ],
    schema: z.object({
      name: z.string().min(1),
      year: z.string().min(1),
      img_path: z.string().min(1).nullable(),
      certification_link: optionalUrl,
      sort_order: sortOrder,
    }),
    listLabel: (row) => String(row.name),
  },
  {
    slug: 'skills',
    table: 'skill_groups',
    title: 'Skills',
    fields: [
      { column: 'heading', label: 'Heading', type: 'text' },
      { column: 'skills', label: 'Skills', type: 'tags', help: 'comma-separated' },
      { column: 'sort_order', label: 'Sort order', type: 'sort_order' },
    ],
    schema: z.object({
      heading: z.string().min(1),
      skills: z.array(z.string().min(1)).min(1),
      sort_order: sortOrder,
    }),
    listLabel: (row) => String(row.heading),
  },
  {
    slug: 'about',
    table: 'about_paragraphs',
    title: 'About',
    fields: [
      {
        column: 'runs',
        label: 'Paragraph',
        type: 'runs',
        help: 'use **bold** and *italic* markup',
      },
      { column: 'sort_order', label: 'Sort order', type: 'sort_order' },
    ],
    schema: z.object({
      runs: z.array(runSchema).min(1),
      sort_order: sortOrder,
    }),
    listLabel: (row) => {
      const runs = row.runs;
      const text = Array.isArray(runs)
        ? runs
            .map((run: unknown) => {
              if (typeof run === 'string') return run;
              const obj = run as { strong?: string; em?: string };
              return obj.strong ?? obj.em ?? '';
            })
            .join('')
        : '';
      return text.length > 80 ? `${text.slice(0, 80)}…` : text;
    },
  },
  {
    slug: 'site',
    table: 'site_settings',
    title: 'Site',
    fields: [imageField('profile_image')],
    schema: z.object({
      profile_image: z.string().min(1).nullable(),
    }),
    listLabel: () => 'Site settings',
  },
];

export function getSection(slug: string): SectionConfig {
  const section = SECTIONS.find((s) => s.slug === slug);
  if (!section) throw new Error(`Unknown admin section: ${slug}`);
  return section;
}
