import { SkeletonLine } from '@/components/skeleton/Skeleton';
import { SkeletonShell } from '@/components/skeleton/SkeletonShell';

const LINES = [72, 64, 68, 44];

export default function AboutLoading() {
  return (
    <SkeletonShell channel="01" label="ABOUT" ariaLabel="Loading about" widthClass="max-w-4xl">
      <div className="space-y-4 px-4 py-6 sm:px-6">
        {LINES.map((length, i) => (
          <SkeletonLine
            key={i}
            length={length}
            textClassName="text-sm"
            cursor={i === LINES.length - 1}
          />
        ))}
      </div>
    </SkeletonShell>
  );
}
