import { beforeEach, describe, expect, it, vi } from 'vitest';

interface PutOptions {
  access: string;
  addRandomSuffix: boolean;
}

const putMock = vi.fn<(name: string, file: File, opts: PutOptions) => Promise<{ url: string }>>();
const delMock = vi.fn<(url: string) => Promise<void>>();
vi.mock('@vercel/blob', () => ({
  put: (name: string, file: File, opts: PutOptions) => putMock(name, file, opts),
  del: (url: string) => delMock(url),
}));

import { deleteImage, imageFileError, isBlobUrl, uploadImage } from '../src/admin/images';

const BLOB_URL = 'https://abc123.public.blob.vercel-storage.com/profile-x1y2.png';

function makeFile(name: string, type: string, bytes = 16): File {
  return new File([new Uint8Array(bytes)], name, { type });
}

beforeEach(() => {
  putMock.mockReset();
  delMock.mockReset();
});

describe('imageFileError', () => {
  it('accepts png, jpeg and webp', () => {
    expect(imageFileError(makeFile('a.png', 'image/png'))).toBeNull();
    expect(imageFileError(makeFile('a.jpg', 'image/jpeg'))).toBeNull();
    expect(imageFileError(makeFile('a.webp', 'image/webp'))).toBeNull();
  });

  it('rejects other mime types', () => {
    expect(imageFileError(makeFile('a.gif', 'image/gif'))).toMatch(/png, jpeg or webp/);
    expect(imageFileError(makeFile('a.svg', 'image/svg+xml'))).toMatch(/png, jpeg or webp/);
    expect(imageFileError(makeFile('a.txt', 'text/plain'))).toMatch(/png, jpeg or webp/);
  });

  it('rejects files over 4MB', () => {
    expect(imageFileError(makeFile('big.png', 'image/png', 4 * 1024 * 1024 + 1))).toMatch(/4MB/);
    expect(imageFileError(makeFile('ok.png', 'image/png', 4 * 1024 * 1024))).toBeNull();
  });
});

describe('isBlobUrl', () => {
  it('matches store-owned urls only', () => {
    expect(isBlobUrl(BLOB_URL)).toBe(true);
    expect(isBlobUrl('/images/profile-picture.png')).toBe(false);
    expect(isBlobUrl('https://example.com/a.png')).toBe(false);
    expect(isBlobUrl('https://evil.com/x.public.blob.vercel-storage.com')).toBe(false);
    expect(isBlobUrl('not a url')).toBe(false);
  });
});

describe('uploadImage', () => {
  it('puts the file publicly with a random suffix and returns the url', async () => {
    putMock.mockResolvedValue({ url: BLOB_URL });
    const file = makeFile('profile.png', 'image/png');
    await expect(uploadImage(file)).resolves.toBe(BLOB_URL);
    expect(putMock).toHaveBeenCalledWith('profile.png', file, {
      access: 'public',
      addRandomSuffix: true,
    });
  });
});

describe('deleteImage', () => {
  it('deletes store-owned urls', async () => {
    delMock.mockResolvedValue(undefined);
    await deleteImage(BLOB_URL);
    expect(delMock).toHaveBeenCalledWith(BLOB_URL);
  });

  it('skips legacy paths and non-strings', async () => {
    await deleteImage('/images/profile-picture.png');
    await deleteImage(null);
    await deleteImage(undefined);
    expect(delMock).not.toHaveBeenCalled();
  });

  it('swallows delete failures', async () => {
    delMock.mockRejectedValue(new Error('boom'));
    await expect(deleteImage(BLOB_URL)).resolves.toBeUndefined();
  });
});
