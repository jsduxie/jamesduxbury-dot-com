import { SkeletonBits, SkeletonLine } from './Skeleton';

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

        <SkeletonLine length={32} className="mt-2" textClassName="text-sm" />
        <SkeletonLine length={26} className="mt-3" textClassName="text-xs" />

        <div className="mt-4 space-y-2">
          <SkeletonLine length={64} textClassName="text-sm" />
          <SkeletonLine length={56} textClassName="text-sm" />
          <SkeletonLine length={40} textClassName="text-sm" cursor />
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
