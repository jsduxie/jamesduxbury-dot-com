import { SkeletonBits, SkeletonLine } from '@/components/skeleton/Skeleton';
import { SkeletonCollapsibleRow } from '@/components/skeleton/SkeletonCollapsibleRow';
import { SkeletonShell } from '@/components/skeleton/SkeletonShell';

function CertificationCardSkeleton() {
  return (
    <div className="flex items-center gap-3 border border-border bg-bg/40 p-3">
      <span
        aria-hidden
        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-sm border border-border bg-surface"
      >
        <SkeletonBits length={2} className="text-xs" />
      </span>
      <div className="flex-1 space-y-1">
        <SkeletonLine length={24} textClassName="text-sm" />
        <SkeletonLine length={4} textClassName="text-xs" />
      </div>
    </div>
  );
}

export default function EducationLoading() {
  return (
    <SkeletonShell
      channel="05"
      label="EDUCATION"
      ariaLabel="Loading education"
      widthClass="max-w-5xl"
    >
      <SkeletonCollapsibleRow />
      <SkeletonCollapsibleRow />
      <div className="border-t border-border px-4 py-5 sm:px-6">
        <SkeletonBits length={28} className="text-xs" />
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <CertificationCardSkeleton />
          <CertificationCardSkeleton />
        </div>
      </div>
    </SkeletonShell>
  );
}
