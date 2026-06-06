import * as simpleIcons from 'simple-icons';

export interface SkillIcon {
  title: string;
  path: string;
}

interface SimpleIcon {
  title: string;
  slug: string;
  path: string;
}

type IconRegistry = Record<string, SimpleIcon | undefined>;

// names whose stripped slug collides with another icon or does not match the export key
const slugOverrides: Record<string, string> = {
  'Node.js': 'nodedotjs',
  'C++': 'cplusplus',
  'GitLab CI/CD': 'gitlab',
};

// names that strip down to an unrelated icon's slug and have no icon of their own
const suppressed = new Set<string>(['C#']);

function defaultSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function exportKey(slug: string): string {
  return 'si' + slug.charAt(0).toUpperCase() + slug.slice(1);
}

export function getSkillIcon(name: string): SkillIcon | null {
  if (suppressed.has(name)) return null;
  const slug = slugOverrides[name] ?? defaultSlug(name);
  const registry = simpleIcons as unknown as IconRegistry;
  const icon = registry[exportKey(slug)];
  if (!icon) return null;
  return { title: icon.title, path: icon.path };
}
