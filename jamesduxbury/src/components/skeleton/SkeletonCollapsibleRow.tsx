import { SkeletonBits, SkeletonLine } from './Skeleton';

export function SkeletonCollapsibleRow() {
  return (
    <div className="border-b border-border last:border-b-0">
      <div className="flex w-full items-center gap-3 px-4 py-3 sm:px-6">
        <span aria-hidden className="font-mono text-xs text-muted">
          ▸
        </span>
        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <SkeletonBits length={22} className="text-sm sm:text-base" />
            <SkeletonBits length={14} className="text-[0.65rem]" />
          </div>
          <SkeletonLine length={18} textClassName="text-xs" />
        </div>
      </div>
    </div>
  );
}
