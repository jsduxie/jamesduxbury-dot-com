import { SkeletonShell } from '@/components/skeleton/SkeletonShell';
import { ProjectRowSkeleton } from '@/components/skeleton/ProjectRowSkeleton';

export default function WorkLoading() {
  return (
    <SkeletonShell channel="02" label="WORK" ariaLabel="Loading work" widthClass="max-w-7xl">
      <ProjectRowSkeleton />
      <ProjectRowSkeleton />
      <ProjectRowSkeleton />
    </SkeletonShell>
  );
}
