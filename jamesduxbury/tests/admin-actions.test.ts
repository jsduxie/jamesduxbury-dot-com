import { neon } from '@neondatabase/serverless';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Session } from 'next-auth';

const authMock = vi.fn<() => Promise<Session | null>>();
vi.mock('@/auth', () => ({
  auth: () => authMock(),
  isAdminSession: (s: Session | null) => s?.user?.login === 'jsduxie',
}));

const revalidated: string[] = [];
vi.mock('next/cache', () => ({ revalidatePath: (path: string) => revalidated.push(path) }));

// redirect mock throws a sentinel error
vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    throw new Error(`REDIRECT:${url}`);
  },
}));

const uploadMock = vi.fn<(file: File) => Promise<string>>();
const deleteImageMock = vi.fn<(url: unknown) => Promise<void>>();
vi.mock('../src/admin/images', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/admin/images')>();
  return {
    ...actual,
    uploadImage: (file: File) => uploadMock(file),
    deleteImage: (url: unknown) => deleteImageMock(url),
  };
});

import { deleteItem, markMessageRead, saveItem } from '../src/admin/actions';
import { siteSettings } from '../src/data/site';
import { countRows, getRow, listRows, makeRoomAt } from '../src/admin/sql';
import { SITE_ROUTES } from '../src/lib/site';

const sql = neon(process.env.DATABASE_URL!);
const session: Session = {
  user: { name: 'James', login: 'jsduxie' },
  expires: '2099-01-01T00:00:00.000Z',
};
const marker = `test-admin-${Date.now()}`;
const aboutMarker = 9000 + Math.floor(Math.random() * 900);
const emailMarker = `${marker}@example.com`;

const EMPTY = { message: null, fieldErrors: {} };

function form(entries: Record<string, string | string[]>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(entries)) {
    for (const v of Array.isArray(value) ? value : [value]) fd.append(key, v);
  }
  return fd;
}

function projectForm(overrides: Record<string, string | string[]> = {}): FormData {
  return form({
    title: 'Test project',
    slug: marker,
    subtitle: 'integration row',
    status: 'dev',
    under_exam: 'on',
    year_start: '2025',
    year_end: '2026',
    tech_stack: 'Vitest, Neon',
    highlights: ['first highlight', 'second highlight'],
    'metrics.label': ['F1', 'p-value'],
    'metrics.value': ['0.9', '< 0.001'],
    'metrics.ratio': ['0.9', ''],
    image_path: '',
    github_link: 'https://github.com/jsduxie/test',
    live_link: '',
    sort_order: '950',
    ...overrides,
  });
}

beforeEach(() => {
  authMock.mockResolvedValue(session);
  revalidated.length = 0;
  uploadMock.mockReset();
  deleteImageMock.mockReset();
  deleteImageMock.mockResolvedValue(undefined);
});

afterAll(async () => {
  await sql`DELETE FROM projects WHERE slug LIKE 'test-admin-%'`;
  await sql`DELETE FROM certifications WHERE name LIKE 'test-admin-%'`;
  await sql`UPDATE site_settings SET profile_image = ${siteSettings.profileImage} WHERE id = 1`;
  await sql`DELETE FROM about_paragraphs WHERE sort_order >= 9000`;
  await sql`DELETE FROM messages WHERE email = ${emailMarker}`;
});

describe('authorisation', () => {
  it.each([
    ['saveItem', () => saveItem('projects', null, EMPTY, projectForm())],
    ['deleteItem', () => deleteItem('projects', 0)],
    ['markMessageRead', () => markMessageRead(0)],
  ])('%s rejects an anonymous caller before touching anything', async (_name, call) => {
    authMock.mockResolvedValue(null);
    await expect(call()).rejects.toThrow('Unauthorised');
  });
});

describe('validation', () => {
  it('returns field errors instead of writing', async () => {
    const state = await saveItem('projects', null, EMPTY, projectForm({ title: '', slug: 'Bad Slug' }));
    expect(state.message).toBe('Validation failed');
    expect(state.fieldErrors.title).toBeTruthy();
    expect(state.fieldErrors.slug).toBe('lowercase letters, digits, and hyphens only');
    expect(revalidated).toHaveLength(0);
  });

  it('rejects an out-of-range metric ratio', async () => {
    const state = await saveItem('projects', null, EMPTY, projectForm({ 'metrics.ratio': ['1.5', ''] }));
    expect(state.fieldErrors.metrics).toBeTruthy();
  });
});

describe('image fields', () => {
  const certName = `${marker}-cert`;
  const urlOne = 'https://abc.public.blob.vercel-storage.com/one.png';
  const urlTwo = 'https://abc.public.blob.vercel-storage.com/two.png';

  function certForm(file?: File): FormData {
    const fd = form({ name: certName, year: '2026', certification_link: '', sort_order: '960' });
    if (file) fd.append('img_path', file);
    return fd;
  }

  function png(name: string): File {
    return new File([new Uint8Array(8)], name, { type: 'image/png' });
  }

  async function certId(): Promise<number> {
    const [{ id }] = await sql`SELECT id FROM certifications WHERE name = ${certName}`;
    return id as number;
  }

  it('uploads the file on create and stores its url', async () => {
    uploadMock.mockResolvedValue(urlOne);
    await expect(saveItem('certifications', null, EMPTY, certForm(png('one.png')))).rejects.toThrow(
      'REDIRECT:/admin/certifications',
    );
    const [row] = await sql`SELECT img_path FROM certifications WHERE name = ${certName}`;
    expect(row.img_path).toBe(urlOne);
    expect(deleteImageMock).not.toHaveBeenCalled();
  });

  it('keeps the stored image when no file is chosen', async () => {
    await expect(saveItem('certifications', await certId(), EMPTY, certForm())).rejects.toThrow(
      'REDIRECT:/admin/certifications',
    );
    const [row] = await sql`SELECT img_path FROM certifications WHERE name = ${certName}`;
    expect(row.img_path).toBe(urlOne);
    expect(uploadMock).not.toHaveBeenCalled();
    expect(deleteImageMock).not.toHaveBeenCalled();
  });

  it('replaces the image and deletes the old blob', async () => {
    uploadMock.mockResolvedValue(urlTwo);
    await expect(
      saveItem('certifications', await certId(), EMPTY, certForm(png('two.png'))),
    ).rejects.toThrow('REDIRECT:/admin/certifications');
    const [row] = await sql`SELECT img_path FROM certifications WHERE name = ${certName}`;
    expect(row.img_path).toBe(urlTwo);
    expect(deleteImageMock).toHaveBeenCalledWith(urlOne);
  });

  it('rejects a wrong mime type before uploading', async () => {
    const gif = new File([new Uint8Array(8)], 'a.gif', { type: 'image/gif' });
    const state = await saveItem('certifications', await certId(), EMPTY, certForm(gif));
    expect(state.fieldErrors.img_path).toMatch(/png, jpeg or webp/);
    expect(uploadMock).not.toHaveBeenCalled();
  });

  it('cleans up the uploaded blob when the insert fails', async () => {
    uploadMock.mockResolvedValue(urlOne);
    // duplicate name violates the unique constraint after the upload
    const state = await saveItem('certifications', null, EMPTY, certForm(png('dupe.png')));
    expect(state.message).toBeTruthy();
    expect(deleteImageMock).toHaveBeenCalledWith(urlOne);
  });

  it('deletes the blob with the row', async () => {
    const id = await certId();
    await deleteItem('certifications', id);
    const rows = await sql`SELECT 1 FROM certifications WHERE id = ${id}`;
    expect(rows).toHaveLength(0);
    expect(deleteImageMock).toHaveBeenCalledWith(urlTwo);
  });
});

describe('site settings singleton', () => {
  it('updates the profile image in place', async () => {
    const url = 'https://abc.public.blob.vercel-storage.com/profile.png';
    uploadMock.mockResolvedValue(url);
    const fd = new FormData();
    fd.append('profile_image', new File([new Uint8Array(8)], 'profile.png', { type: 'image/png' }));
    await expect(saveItem('site', 1, EMPTY, fd)).rejects.toThrow('REDIRECT:/admin/site');
    const [row] = await sql`SELECT profile_image FROM site_settings WHERE id = 1`;
    expect(row.profile_image).toBe(url);
    expect(deleteImageMock).toHaveBeenCalledWith(siteSettings.profileImage);
  });

  it('rejects a second settings row', async () => {
    const fd = new FormData();
    fd.append('profile_image', new File([new Uint8Array(8)], 'extra.png', { type: 'image/png' }));
    uploadMock.mockResolvedValue('https://abc.public.blob.vercel-storage.com/extra.png');
    const state = await saveItem('site', null, EMPTY, fd);
    expect(state.message).toBeTruthy();
    const rows = await sql`SELECT id FROM site_settings`;
    expect(rows).toHaveLength(1);
  });
});

describe('project CRUD round trip', () => {
  it('creates a row covering every field type', async () => {
    await expect(saveItem('projects', null, EMPTY, projectForm())).rejects.toThrow(
      'REDIRECT:/admin/projects',
    );
    const [row] = await sql`SELECT * FROM projects WHERE slug = ${marker}`;
    expect(row.title).toBe('Test project');
    expect(row.status).toBe('dev');
    expect(row.under_exam).toBe(true);
    expect(row.year_start).toBe(2025);
    expect(row.tech_stack).toEqual(['Vitest', 'Neon']);
    expect(row.highlights).toEqual(['first highlight', 'second highlight']);
    expect(row.metrics).toEqual([
      { label: 'F1', value: '0.9', ratio: 0.9 },
      { label: 'p-value', value: '< 0.001' },
    ]);
    expect(row.image_path).toBeNull();
    expect(row.github_link).toBe('https://github.com/jsduxie/test');
    expect(row.live_link).toBeNull();
    expect(row.sort_order).toBe(950);
    for (const route of SITE_ROUTES) expect(revalidated).toContain(route);
    expect(revalidated).toContain('/admin/projects');
  });

  it('updates the row in place', async () => {
    const [{ id }] = await sql`SELECT id FROM projects WHERE slug = ${marker}`;
    await expect(
      saveItem(
        'projects',
        id as number,
        EMPTY,
        projectForm({ title: 'Renamed', under_exam: [], 'metrics.label': [], 'metrics.value': [], 'metrics.ratio': [] }),
      ),
    ).rejects.toThrow('REDIRECT:/admin/projects');
    const [row] = await sql`SELECT * FROM projects WHERE id = ${id}`;
    expect(row.title).toBe('Renamed');
    expect(row.under_exam).toBe(false);
    expect(row.metrics).toBeNull();
  });

  it('surfaces a DB constraint failure as a form message', async () => {
    const state = await saveItem('projects', null, EMPTY, projectForm({ sort_order: '951' }));
    expect(state.message).toBeTruthy();
    expect(state.fieldErrors).toEqual({});
  });

  it('reads through the admin sql helpers', async () => {
    const [{ id }] = await sql`SELECT id FROM projects WHERE slug = ${marker}`;
    const row = await getRow('projects', id as number);
    expect(row?.title).toBe('Renamed');
    expect(await getRow('projects', 0)).toBeNull();
    const rows = await listRows('projects');
    expect(rows.some((r) => r.id === id)).toBe(true);
    expect(await countRows('projects')).toBe(rows.length);
  });

  it('deletes the row', async () => {
    const [{ id }] = await sql`SELECT id FROM projects WHERE slug = ${marker}`;
    await deleteItem('projects', id as number);
    expect(await getRow('projects', id as number)).toBeNull();
    expect(revalidated).toContain('/admin/projects');
  });
});

describe('sort order shifting', () => {
  it('makes room at a taken position, highest row first', async () => {
    await sql`
      INSERT INTO about_paragraphs (runs, sort_order)
      VALUES ('["shift a"]', ${aboutMarker}), ('["shift b"]', ${aboutMarker + 1})
    `;
    // this table has a unique sort_order constraint
    await makeRoomAt('about_paragraphs', aboutMarker, null);
    const rows = await sql`
      SELECT runs, sort_order FROM about_paragraphs WHERE sort_order >= 9000 ORDER BY sort_order
    `;
    expect(rows.map((r) => [r.runs[0], r.sort_order])).toEqual([
      ['shift a', aboutMarker + 1],
      ['shift b', aboutMarker + 2],
    ]);
  });

  it('does nothing when the position is free', async () => {
    const before = await sql`SELECT id, sort_order FROM about_paragraphs ORDER BY id`;
    await makeRoomAt('about_paragraphs', 8500, null);
    const after = await sql`SELECT id, sort_order FROM about_paragraphs ORDER BY id`;
    expect(after).toEqual(before);
  });

  it('saving into a taken slot shifts the incumbents down', async () => {
    await expect(
      saveItem(
        'about',
        null,
        EMPTY,
        form({ runs: 'inserted **here**', sort_order: String(aboutMarker + 1) }),
      ),
    ).rejects.toThrow('REDIRECT:/admin/about');
    const rows = await sql`
      SELECT runs, sort_order FROM about_paragraphs WHERE sort_order >= 9000 ORDER BY sort_order
    `;
    expect(rows.map((r) => [r.runs, r.sort_order])).toEqual([
      [['inserted ', { strong: 'here' }], aboutMarker + 1],
      [['shift a'], aboutMarker + 2],
      [['shift b'], aboutMarker + 3],
    ]);
  });
});

describe('messages', () => {
  it('marks a message as read', async () => {
    const [{ id }] = await sql`
      INSERT INTO messages (name, email, message) VALUES ('Test', ${emailMarker}, 'hi')
      RETURNING id
    `;
    await markMessageRead(id as number);
    const [row] = await sql`SELECT read FROM messages WHERE id = ${id}`;
    expect(row.read).toBe(true);
    expect(revalidated).toContain('/admin/messages');
  });
});
