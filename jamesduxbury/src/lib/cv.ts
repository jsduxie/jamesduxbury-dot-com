import type { SiteSettings } from '@/data/site';

// the static pdf remains the fallback until a CV is uploaded via the console
export function cvHref(settings: SiteSettings): string {
  return settings.cv ?? '/data/CV.pdf';
}

export function cvDownloadName(settings: SiteSettings): string {
  return `${settings.ownerName.replace(/ /g, '_')}_CV.pdf`;
}
