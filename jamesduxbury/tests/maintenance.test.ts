import { neon } from '@neondatabase/serverless';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const DEAD = 'https://x.public.blob.vercel-storage.com/dev/dead.png';
const ALIVE = 'https://x.public.blob.vercel-storage.com/dev/alive.png';
const ORPHAN = 'https://x.public.blob.vercel-storage.com/dev/orphan.png';

const deleteImageMock = vi.fn<(url: unknown) => Promise<void>>();
const listEnvBlobsMock = vi.fn<() => Promise<string[]>>();

vi.mock('../src/admin/images', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/admin/images')>();
  return {
    ...actual,
    blobIsAlive: (url: string) => Promise.resolve(url !== DEAD),
    listEnvBlobs: () => listEnvBlobsMock(),
    deleteImage: (url: unknown) => deleteImageMock(url),
  };
});

import { runBlobMaintenance } from '../src/admin/maintenance';

const sql = neon(process.env.DATABASE_URL!);
const certName = 'maintenance-test-cert';
let originalProfile: string;

beforeEach(async () => {
  deleteImageMock.mockReset();
  listEnvBlobsMock.mockReset().mockResolvedValue([]);
  const [row] = await sql`SELECT profile_image FROM site_settings WHERE id = 1`;
  originalProfile = row.profile_image;
});

afterEach(async () => {
  await sql`DELETE FROM certifications WHERE name = ${certName}`;
  await sql`DELETE FROM architecture_sections WHERE sort_order = 9998`;
  await sql`UPDATE site_settings SET profile_image = ${originalProfile} WHERE id = 1`;
});

describe('runBlobMaintenance', () => {
  it('nulls a nullable reference whose blob has vanished', async () => {
    await sql`INSERT INTO certifications (name, year, img_path, sort_order)
      VALUES (${certName}, '2024', ${DEAD}, 999)`;
    const report = await runBlobMaintenance();
    const [row] = await sql`SELECT img_path FROM certifications WHERE name = ${certName}`;
    expect(row.img_path).toBeNull();
    expect(report.healed).toContainEqual({ table: 'certifications', column: 'img_path' });
  });

  it('reports a dangling non-nullable reference without nulling it', async () => {
    await sql`UPDATE site_settings SET profile_image = ${DEAD} WHERE id = 1`;
    const report = await runBlobMaintenance();
    const [row] = await sql`SELECT profile_image FROM site_settings WHERE id = 1`;
    expect(row.profile_image).toBe(DEAD);
    expect(report.dangling).toContainEqual({
      table: 'site_settings',
      column: 'profile_image',
      url: DEAD,
    });
  });

  it('deletes blobs no row references and keeps referenced ones', async () => {
    await sql`INSERT INTO certifications (name, year, img_path, sort_order)
      VALUES (${certName}, '2024', ${ALIVE}, 999)`;
    listEnvBlobsMock.mockResolvedValue([ALIVE, ORPHAN]);
    const report = await runBlobMaintenance();
    expect(deleteImageMock).toHaveBeenCalledWith(ORPHAN);
    expect(deleteImageMock).not.toHaveBeenCalledWith(ALIVE);
    expect(report.purged).toBe(1);
  });

  it('keeps a blob referenced only from inside prose blocks', async () => {
    const inline = 'https://x.public.blob.vercel-storage.com/dev/inline.png';
    await sql`INSERT INTO architecture_sections (kind, body, sort_order)
      VALUES ('build', ${JSON.stringify([{ kind: 'image', url: inline, alt: '' }])}, 9998)`;
    listEnvBlobsMock.mockResolvedValue([inline, ORPHAN]);
    const report = await runBlobMaintenance();
    expect(deleteImageMock).toHaveBeenCalledWith(ORPHAN);
    expect(deleteImageMock).not.toHaveBeenCalledWith(inline);
    expect(report.purged).toBe(1);
  });
});
