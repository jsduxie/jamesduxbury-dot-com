import { SkeletonBits, SkeletonCursor } from '@/components/skeleton/Skeleton';
import { SkeletonShell } from '@/components/skeleton/SkeletonShell';

const LINES = [72, 64, 68, 44];

export default function AboutLoading() {
  return (
    <SkeletonShell channel="01" label="ABOUT" ariaLabel="Loading about" widthClass="max-w-4xl">
      <div className="space-y-4 px-4 py-6 sm:px-6">
        {LINES.map((length, i) => (
          <p key={i} className="overflow-hidden whitespace-nowrap">
            <SkeletonBits length={length} className="text-sm" />
            {i === LINES.length - 1 && <SkeletonCursor />}
          </p>
        ))}
      </div>
    </SkeletonShell>
  );
}
