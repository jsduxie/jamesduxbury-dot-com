import { SkeletonBits } from '@/components/skeleton/Skeleton';
import { SkeletonShell } from '@/components/skeleton/SkeletonShell';

const GROUPS = [
  [8, 12, 6, 10, 9],
  [10, 7, 11, 6, 8, 9],
  [9, 6, 12, 8],
];

export default function SkillsLoading() {
  return (
    <SkeletonShell channel="03" label="SKILLS" ariaLabel="Loading skills" widthClass="max-w-5xl">
      <div className="divide-y divide-border">
        {GROUPS.map((chips, i) => (
          <div key={i} className="px-4 py-5 sm:px-6">
            <div className="flex items-baseline justify-between gap-3">
              <SkeletonBits length={14} className="text-sm" />
              <SkeletonBits length={7} className="text-xs" />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {chips.map((length, j) => (
                <span key={j} className="skill-badge">
                  <SkeletonBits length={length} />
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SkeletonShell>
  );
}
