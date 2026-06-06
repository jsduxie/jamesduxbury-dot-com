import { SkeletonBits, SkeletonCursor } from '@/components/skeleton/Skeleton';
import { SkeletonShell } from '@/components/skeleton/SkeletonShell';

function ChannelRowSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-1 px-4 py-3.5 sm:grid-cols-[8rem_1fr_auto] sm:items-baseline sm:gap-6 sm:px-6 sm:py-4">
      <SkeletonBits length={6} className="text-xs" />
      <SkeletonBits length={20} className="text-xs" />
      <SkeletonBits length={7} className="text-xs" />
    </div>
  );
}

function FieldSkeleton({ inputLength }: { inputLength: number }) {
  return (
    <div className="px-4 py-5 sm:px-6">
      <SkeletonBits length={7} className="text-[0.65rem] sm:text-xs" />
      <div className="mt-2 w-full overflow-hidden whitespace-nowrap border border-border bg-bg px-3 py-2.5">
        <SkeletonBits length={inputLength} className="text-sm" />
      </div>
    </div>
  );
}

export default function ContactLoading() {
  return (
    <SkeletonShell channel="06" label="CONTACT" ariaLabel="Loading contact" widthClass="max-w-4xl">
      <div className="px-4 py-5 sm:px-6">
        <SkeletonBits length={15} className="text-xs" />
      </div>
      <div className="divide-y divide-border border-y border-border">
        <ChannelRowSkeleton />
        <ChannelRowSkeleton />
        <ChannelRowSkeleton />
      </div>
      <div className="px-4 py-5 sm:px-6">
        <SkeletonBits length={26} className="text-xs" />
      </div>
      <div className="divide-y divide-border border-t border-border">
        <FieldSkeleton inputLength={18} />
        <FieldSkeleton inputLength={24} />
        <FieldSkeleton inputLength={40} />
        <div className="px-4 py-5 sm:px-6">
          <SkeletonBits length={10} className="text-sm" />
          <SkeletonCursor />
        </div>
      </div>
    </SkeletonShell>
  );
}
