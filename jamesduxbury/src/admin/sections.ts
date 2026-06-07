import { z } from 'zod';
import { runText, type AboutParagraph } from '@/data/about';
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

const proseSchema = z.array(z.array(runSchema).min(1)).min(1);
const proseHelp = 'paragraphs separated by a blank line; **bold** and *italic* markup';

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
      const text = Array.isArray(runs) ? runText(runs as AboutParagraph) : '';
      return text.length > 80 ? `${text.slice(0, 80)}…` : text;
    },
  },
  {
    slug: 'case-studies',
    table: 'case_studies',
    title: 'Case studies',
    fields: [
      {
        column: 'project_slug',
        label: 'Project slug',
        type: 'text',
        help: 'slug of the project row',
      },
      { column: 'problem', label: 'Problem', type: 'prose', help: proseHelp },
      { column: 'approach', label: 'Approach', type: 'prose', help: proseHelp },
      { column: 'outcome', label: 'Outcome', type: 'prose', help: proseHelp },
      imageField('image_path'),
    ],
    schema: z.object({
      project_slug: z.string().regex(/^[a-z0-9-]+$/, 'lowercase letters, digits, and hyphens only'),
      problem: proseSchema,
      approach: proseSchema,
      outcome: proseSchema.nullable(),
      image_path: z.string().min(1).nullable(),
    }),
    listLabel: (row) => String(row.project_slug),
  },
  {
    slug: 'architecture',
    table: 'architecture_sections',
    title: 'Architecture',
    fields: [
      {
        column: 'kind',
        label: 'Kind',
        type: 'select',
        options: ['intro', 'stack', 'decision', 'build'],
        help: 'where on the page the section renders',
      },
      { column: 'title', label: 'Title', type: 'text', help: 'shown on decision cards only' },
      { column: 'body', label: 'Body', type: 'prose', help: proseHelp },
      { column: 'sort_order', label: 'Sort order', type: 'sort_order' },
    ],
    schema: z.object({
      kind: z.enum(['intro', 'stack', 'decision', 'build']),
      title: z.string().min(1).nullable(),
      body: proseSchema,
      sort_order: sortOrder,
    }),
    listLabel: (row) => (row.title ? String(row.title) : String(row.kind)),
  },
  {
    slug: 'site',
    table: 'site_settings',
    title: 'Site',
    fields: [
      imageField('profile_image'),
      { column: 'owner_name', label: 'Owner name', type: 'text' },
      { column: 'tagline', label: 'Tagline', type: 'text', help: 'page titles and the OG card' },
      { column: 'contact_email', label: 'Contact email', type: 'text' },
      { column: 'github_url', label: 'GitHub URL', type: 'url' },
      { column: 'linkedin_url', label: 'LinkedIn URL', type: 'url' },
      { column: 'site_version', label: 'Site version', type: 'text' },
      {
        column: 'meta_description',
        label: 'Meta description',
        type: 'textarea',
        help: 'search snippet for the home and about pages',
      },
      {
        column: 'og_description',
        label: 'OG description',
        type: 'textarea',
        help: 'social link preview text',
      },
      { column: 'og_footer', label: 'OG footer', type: 'text', help: 'OG card footer line' },
      { column: 'entry_role', label: 'Entry role', type: 'text' },
      { column: 'entry_credential', label: 'Entry credential', type: 'text' },
      { column: 'entry_education', label: 'Entry education', type: 'text' },
      { column: 'entry_status', label: 'Entry status', type: 'text' },
      { column: 'entry_years', label: 'Entry years', type: 'text' },
      {
        column: 'cv',
        label: 'CV',
        type: 'document',
        help: 'pdf up to 4MB; empty keeps the current file',
      },
    ],
    schema: z.object({
      profile_image: z.string().min(1).nullable(),
      owner_name: z.string().min(1),
      tagline: z.string().min(1),
      contact_email: z.email(),
      github_url: z.url(),
      linkedin_url: z.url(),
      site_version: z.string().min(1),
      meta_description: z.string().min(1),
      og_description: z.string().min(1),
      og_footer: z.string().min(1),
      entry_role: z.string().min(1),
      entry_credential: z.string().min(1),
      entry_education: z.string().min(1),
      entry_status: z.string().min(1),
      entry_years: z.string().min(1),
      cv: z.string().min(1).nullable(),
    }),
    listLabel: () => 'Site settings',
  },
];

export function getSection(slug: string): SectionConfig {
  const section = SECTIONS.find((s) => s.slug === slug);
  if (!section) throw new Error(`Unknown admin section: ${slug}`);
  return section;
}
