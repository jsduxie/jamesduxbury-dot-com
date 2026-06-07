import { describe, expect, it } from 'vitest';
import { fieldDefault, parseFields, type FieldDef } from '../src/admin/fields';
import { parseProse, parseRuns, serialiseProse, serialiseRuns } from '../src/admin/runs';
import { getSection, SECTIONS } from '../src/admin/sections';

function form(entries: Record<string, string | string[]>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(entries)) {
    for (const v of Array.isArray(value) ? value : [value]) fd.append(key, v);
  }
  return fd;
}

describe('about runs markup', () => {
  it('parses plain text, bold, and italic into runs', () => {
    expect(parseRuns('plain **bold** and *em* end')).toEqual([
      'plain ',
      { strong: 'bold' },
      ' and ',
      { em: 'em' },
      ' end',
    ]);
  });

  it('round-trips the seeded about paragraphs shape', () => {
    const runs = [
      { strong: 'Accredited Member' },
      ' (AfCIIS) · ',
      { em: 'FG-HAN' },
      ' certified.',
    ];
    expect(parseRuns(serialiseRuns(runs))).toEqual(runs);
  });

  it('treats unmatched asterisks as plain text', () => {
    expect(parseRuns('a * b')).toEqual(['a * b']);
  });
});

describe('prose markup', () => {
  it('splits paragraphs on blank lines and parses runs', () => {
    expect(parseProse('one **two**\n\n\nthree\nwrapped')).toEqual([
      ['one ', { strong: 'two' }],
      ['three wrapped'],
    ]);
  });

  it('round-trips through serialiseProse', () => {
    const text = 'one **two**\n\n*three* four';
    expect(serialiseProse(parseProse(text))).toBe(text);
  });

  it('parses empty input to no paragraphs', () => {
    expect(parseProse('')).toEqual([]);
    expect(parseProse('  \n\n  ')).toEqual([]);
  });
});

describe('parseFields', () => {
  const defs: FieldDef[] = [
    { column: 'title', label: 'Title', type: 'text' },
    { column: 'notes', label: 'Notes', type: 'textarea' },
    { column: 'link', label: 'Link', type: 'url' },
    { column: 'status', label: 'Status', type: 'select', options: ['live', 'dev'] },
    { column: 'flag', label: 'Flag', type: 'checkbox' },
    { column: 'year', label: 'Year', type: 'number' },
    { column: 'sort_order', label: 'Sort', type: 'sort_order' },
    { column: 'bullets', label: 'Bullets', type: 'bullets' },
    { column: 'tags', label: 'Tags', type: 'tags' },
    { column: 'metrics', label: 'Metrics', type: 'metrics' },
    { column: 'runs', label: 'Runs', type: 'runs' },
    { column: 'image', label: 'Image', type: 'image' },
    { column: 'prose', label: 'Prose', type: 'prose' },
  ];

  it('maps every field type to its DB value', () => {
    const fd = form({
      title: '  Spaced  ',
      notes: 'line one',
      link: 'https://example.com',
      status: 'dev',
      flag: 'on',
      year: '2026',
      sort_order: '3',
      bullets: ['first', '  ', 'second'],
      tags: 'a, b , ,c',
      'metrics.label': ['F1', ''],
      'metrics.value': ['0.9', ''],
      'metrics.ratio': ['0.9', ''],
      runs: 'hello **world**',
      prose: 'first *para*\n\nsecond para',
    });
    expect(parseFields(defs, fd)).toEqual({
      title: 'Spaced',
      notes: 'line one',
      link: 'https://example.com',
      status: 'dev',
      flag: true,
      year: 2026,
      sort_order: 3,
      bullets: ['first', 'second'],
      tags: ['a', 'b', 'c'],
      metrics: [{ label: 'F1', value: '0.9', ratio: 0.9 }],
      runs: ['hello ', { strong: 'world' }],
      image: null,
      prose: [
        ['first ', { em: 'para' }],
        ['second para'],
      ],
    });
  });

  it('maps absent inputs to empty values', () => {
    expect(parseFields(defs, form({}))).toEqual({
      title: null,
      notes: null,
      link: null,
      status: null,
      flag: false,
      year: null,
      sort_order: 0,
      bullets: [],
      tags: [],
      metrics: null,
      runs: [],
      image: null,
      prose: null,
    });
  });

  it('keeps a metric ratio optional', () => {
    const fd = form({ 'metrics.label': 'p-value', 'metrics.value': '< 0.001', 'metrics.ratio': '' });
    expect(parseFields([defs[9]], fd)).toEqual({
      metrics: [{ label: 'p-value', value: '< 0.001' }],
    });
  });
});

describe('fieldDefault', () => {
  it('round-trips DB values back into form inputs', () => {
    const cases: [FieldDef, unknown, unknown][] = [
      [{ column: 'c', label: 'c', type: 'text' }, 'hello', 'hello'],
      [{ column: 'c', label: 'c', type: 'text' }, null, ''],
      [{ column: 'c', label: 'c', type: 'checkbox' }, true, true],
      [{ column: 'c', label: 'c', type: 'checkbox' }, false, false],
      [{ column: 'c', label: 'c', type: 'number' }, 2026, '2026'],
      [{ column: 'c', label: 'c', type: 'number' }, null, ''],
      [{ column: 'c', label: 'c', type: 'sort_order' }, 0, '0'],
      [{ column: 'c', label: 'c', type: 'bullets' }, ['a', 'b'], ['a', 'b']],
      [{ column: 'c', label: 'c', type: 'bullets' }, null, []],
      [{ column: 'c', label: 'c', type: 'tags' }, ['a', 'b'], 'a, b'],
      [
        { column: 'c', label: 'c', type: 'metrics' },
        [{ label: 'F1', value: '0.9', ratio: 0.9 }, { label: 'p', value: '<1' }],
        [
          { label: 'F1', value: '0.9', ratio: '0.9' },
          { label: 'p', value: '<1', ratio: '' },
        ],
      ],
      [{ column: 'c', label: 'c', type: 'metrics' }, null, []],
      [{ column: 'c', label: 'c', type: 'runs' }, ['a ', { strong: 'b' }], 'a **b**'],
      [{ column: 'c', label: 'c', type: 'image' }, 'https://blob/x.png', 'https://blob/x.png'],
      [{ column: 'c', label: 'c', type: 'image' }, null, ''],
      [
        { column: 'c', label: 'c', type: 'prose' },
        [['a ', { strong: 'b' }], ['c']],
        'a **b**\n\nc',
      ],
      [{ column: 'c', label: 'c', type: 'prose' }, null, ''],
    ];
    for (const [def, dbValue, expected] of cases) {
      expect(fieldDefault(def, dbValue)).toEqual(expected);
    }
  });
});

describe('section registry', () => {
  it('exposes the nine content sections', () => {
    expect(SECTIONS.map((s) => s.slug)).toEqual([
      'projects',
      'experience',
      'education',
      'certifications',
      'skills',
      'about',
      'case-studies',
      'architecture',
      'site',
    ]);
  });

  it('throws for an unknown slug', () => {
    expect(() => getSection('nope')).toThrow('Unknown admin section');
  });

  const samples: Record<string, Record<string, string | string[]>> = {
    projects: {
      title: 'Test',
      slug: 'test-slug',
      subtitle: 'sub',
      status: 'dev',
      year_start: '2025',
      year_end: '2026',
      tech_stack: 'a, b',
      highlights: ['one'],
      'metrics.label': 'F1',
      'metrics.value': '0.9',
      'metrics.ratio': '0.9',
      sort_order: '1',
    },
    experience: {
      title: 'Engineer',
      organisation: 'Org',
      period: '2025',
      year_start: '2025',
      bullets: ['did a thing'],
      sort_order: '1',
    },
    education: {
      qualification: 'MEng',
      institution: 'Durham',
      period: '2022 – 2026',
      year_end: '2026',
      sort_order: '1',
    },
    certifications: { name: 'Cert', year: '2024', sort_order: '1' },
    skills: { heading: 'Languages', skills: 'Python, TypeScript', sort_order: '1' },
    about: { runs: 'plain **bold**', sort_order: '1' },
    'case-studies': {
      project_slug: 'test-slug',
      problem: 'the **problem** statement\n\nsecond paragraph',
      approach: 'how it was built',
    },
    architecture: {
      kind: 'decision',
      title: 'No ORM',
      body: 'raw **sql** everywhere',
      sort_order: '1',
    },
    site: {
      owner_name: 'James Duxbury',
      tagline: 'Software Engineer',
      contact_email: 'me@example.com',
      github_url: 'https://github.com/jsduxie',
      linkedin_url: 'https://linkedin.com/in/jamesduxbury03',
      site_version: 'v2.0',
      meta_description: 'a description',
      og_description: 'an og description',
      og_footer: 'a footer',
      entry_role: 'Software engineer',
      entry_credential: 'AfCIIS',
      entry_education: 'Durham',
      entry_status: 'FINAL YEAR',
      entry_years: '2022 - 2026',
    },
  };

  it.each(SECTIONS.map((s) => [s.slug] as const))(
    '%s: a filled form parses and validates',
    (slug) => {
      const section = getSection(slug);
      const parsed = section.schema.safeParse(parseFields(section.fields, form(samples[slug])));
      expect(parsed.success).toBe(true);
    },
  );

  it.each(SECTIONS.map((s) => [s.slug] as const))(
    '%s: an empty form fails validation',
    (slug) => {
      const section = getSection(slug);
      const parsed = section.schema.safeParse(parseFields(section.fields, form({})));
      expect(parsed.success).toBe(false);
    },
  );

  it('labels rows for every section list page', () => {
    expect(getSection('projects').listLabel({ title: 'FG-HAN' })).toBe('FG-HAN');
    expect(getSection('experience').listLabel({ title: 'Intern', organisation: 'CTM' })).toBe(
      'Intern · CTM',
    );
    expect(getSection('education').listLabel({ qualification: 'MEng' })).toBe('MEng');
    expect(getSection('certifications').listLabel({ name: 'ITIL 4' })).toBe('ITIL 4');
    expect(getSection('skills').listLabel({ heading: 'Languages' })).toBe('Languages');
    expect(getSection('site').listLabel({})).toBe('Site settings');
    expect(getSection('case-studies').listLabel({ project_slug: 'fg-han' })).toBe('fg-han');
    expect(getSection('architecture').listLabel({ kind: 'decision', title: 'No ORM' })).toBe(
      'No ORM',
    );
    expect(getSection('architecture').listLabel({ kind: 'intro', title: null })).toBe('intro');
    expect(getSection('about').listLabel({ runs: ['plain ', { strong: 'bold' }] })).toBe(
      'plain bold',
    );
  });

  it('truncates long about paragraphs in the list label', () => {
    const label = getSection('about').listLabel({ runs: ['x'.repeat(120)] });
    expect(label).toHaveLength(81);
    expect(label.endsWith('…')).toBe(true);
  });

  it('rejects an invalid project status and slug', () => {
    const section = getSection('projects');
    const bad = { ...samples.projects, status: 'retired', slug: 'Bad Slug' };
    const parsed = section.schema.safeParse(parseFields(section.fields, form(bad)));
    expect(parsed.success).toBe(false);
    const paths = parsed.success ? [] : parsed.error.issues.map((i) => i.path[0]);
    expect(paths).toContain('status');
    expect(paths).toContain('slug');
  });

  it('treats an empty experience year_end as present', () => {
    const section = getSection('experience');
    const parsed = section.schema.safeParse(
      parseFields(section.fields, form(samples.experience)),
    );
    expect(parsed.success && parsed.data.year_end).toBeNull();
  });
});
