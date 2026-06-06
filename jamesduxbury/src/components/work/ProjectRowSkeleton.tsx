import { SkeletonBits, SkeletonCursor } from '@/components/skeleton/Skeleton';

export function ProjectRowSkeleton() {
  return (
    <article className="border-b border-border last:border-b-0">
      <div className="px-4 py-6 sm:px-6 sm:py-7">
        <header className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <SkeletonBits length={3} className="text-xs" />
          <SkeletonBits length={18} className="text-base sm:text-lg" />
          <SkeletonBits length={11} className="text-xs" />
          <span className="ml-auto">
            <SkeletonBits length={7} className="text-xs" />
          </span>
        </header>

        <p className="mt-2 overflow-hidden whitespace-nowrap">
          <SkeletonBits length={32} className="text-sm" />
        </p>

        <p className="mt-3 overflow-hidden whitespace-nowrap">
          <SkeletonBits length={26} className="text-xs" />
        </p>

        <div className="mt-4 space-y-2">
          <p className="overflow-hidden whitespace-nowrap">
            <SkeletonBits length={64} className="text-sm" />
          </p>
          <p className="overflow-hidden whitespace-nowrap">
            <SkeletonBits length={56} className="text-sm" />
          </p>
          <p className="overflow-hidden whitespace-nowrap">
            <SkeletonBits length={40} className="text-sm" />
            <SkeletonCursor />
          </p>
        </div>
      </div>

      <div className="border-t border-border bg-bg/40 px-4 py-4 sm:px-6">
        <SkeletonBits length={7} className="text-xs" />
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <SkeletonBits length={28} className="text-xs" />
          <SkeletonBits length={28} className="text-xs" />
        </div>
      </div>
    </article>
  );
}
