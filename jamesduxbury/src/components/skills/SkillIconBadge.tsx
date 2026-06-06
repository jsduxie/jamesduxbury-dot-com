import { getSkillIcon } from './skillIcon';

export function SkillIconBadge({ name }: { name: string }) {
  const icon = getSkillIcon(name);
  if (!icon) return null;
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-[1em] w-[1em] shrink-0"
    >
      <path d={icon.path} />
    </svg>
  );
}
