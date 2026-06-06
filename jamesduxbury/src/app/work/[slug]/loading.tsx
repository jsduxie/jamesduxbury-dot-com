import { PageShell } from '@/components/PageShell';
import { SkeletonLine } from '@/components/skeleton/Skeleton';

export default function CaseStudyLoading() {
  return (
    <PageShell
      widthClass="max-w-4xl"
      backHref="/work"
      backLabel="/ work"
      loadingLabel="loading case study"
    >
      <div className="border-b border-border pb-6">
        <SkeletonLine length={16} textClassName="text-2xl sm:text-3xl" cursor />
        <SkeletonLine length={32} className="mt-3" textClassName="text-sm" />
        <SkeletonLine length={24} className="mt-3" textClassName="text-xs" />
      </div>
      <div className="mt-6 space-y-3 border border-border bg-surface/40 px-4 py-6 backdrop-blur-sm sm:px-6">
        <SkeletonLine length={8} textClassName="text-xs" />
        <SkeletonLine length={48} textClassName="text-sm" />
        <SkeletonLine length={40} textClassName="text-sm" />
        <SkeletonLine length={8} className="pt-3" textClassName="text-xs" />
        <SkeletonLine length={48} textClassName="text-sm" />
        <SkeletonLine length={36} textClassName="text-sm" />
      </div>
    </PageShell>
  );
}
