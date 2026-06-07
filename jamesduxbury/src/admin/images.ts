import { del, list, put } from '@vercel/blob';

const ALLOWED_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);
// matches the serverActions bodySizeLimit in next.config.ts
const MAX_BYTES = 4 * 1024 * 1024;

// one shared store, two DBs: the prefix scopes a purge to its own environment
export function blobEnv(): string {
  return process.env.VERCEL_ENV === 'production' ? 'prod' : 'dev';
}

export function imageFileError(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) return 'Image must be png, jpeg or webp';
  if (file.size > MAX_BYTES) return 'Image must be 4MB or smaller';
  return null;
}

export function documentFileError(file: File): string | null {
  if (file.type !== 'application/pdf') return 'Document must be a pdf';
  if (file.size > MAX_BYTES) return 'Document must be 4MB or smaller';
  return null;
}

export function isBlobUrl(url: string): boolean {
  try {
    return new URL(url).hostname.endsWith('.public.blob.vercel-storage.com');
  } catch {
    return false;
  }
}

export async function uploadImage(file: File): Promise<string> {
  const { url } = await put(`${blobEnv()}/${file.name}`, file, {
    access: 'public',
    addRandomSuffix: true,
  });
  return url;
}

// skips legacy /images paths so only store-owned blobs are ever deleted
export async function deleteImage(url: unknown): Promise<void> {
  if (typeof url !== 'string' || !isBlobUrl(url)) return;
  try {
    await del(url);
  } catch {
    // a failed delete only leaves an orphan; the row no longer references it
  }
}

// only a definitive 404 counts as gone; a transient error must never trigger a heal or purge
export async function blobIsAlive(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD', cache: 'no-store' });
    return res.status !== 404;
  } catch {
    return true;
  }
}

// blobs under this environment's prefix only, so a purge never touches the other env
export async function listEnvBlobs(): Promise<string[]> {
  const urls: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: `${blobEnv()}/`, cursor });
    for (const blob of page.blobs) urls.push(blob.url);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return urls;
}
