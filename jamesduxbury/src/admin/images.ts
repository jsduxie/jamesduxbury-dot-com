import { del, put } from '@vercel/blob';

const ALLOWED_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);
// matches the serverActions bodySizeLimit in next.config.ts
const MAX_BYTES = 4 * 1024 * 1024;

export function imageFileError(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) return 'Image must be png, jpeg or webp';
  if (file.size > MAX_BYTES) return 'Image must be 4MB or smaller';
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
  const { url } = await put(file.name, file, { access: 'public', addRandomSuffix: true });
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
