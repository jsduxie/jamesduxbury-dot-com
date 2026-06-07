import { SkeletonBits, SkeletonLine } from '@/components/skeleton/Skeleton';
import { SkeletonShell } from '@/components/skeleton/SkeletonShell';

export default function ArchitectureLoading() {
  return (
    <SkeletonShell
      channel="07"
      label="ARCHITECTURE"
      ariaLabel="Loading architecture"
      widthClass="max-w-5xl"
    >
      <div className="space-y-3 px-4 py-6 sm:px-6">
        <SkeletonLine length={48} textClassName="text-sm" cursor />
        <SkeletonLine length={40} textClassName="text-sm" />
        <SkeletonBits length={28} className="text-xs" />
      </div>
      <div className="space-y-3 border-t border-border px-4 py-6 sm:px-6">
        <SkeletonBits length={6} className="text-xs" />
        <SkeletonLine length={44} textClassName="text-sm" />
        <SkeletonLine length={44} textClassName="text-sm" />
      </div>
    </SkeletonShell>
  );
}
