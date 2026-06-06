import { SkeletonCollapsibleRow } from '@/components/skeleton/SkeletonCollapsibleRow';
import { SkeletonShell } from '@/components/skeleton/SkeletonShell';

export default function ExperienceLoading() {
  return (
    <SkeletonShell
      channel="04"
      label="EXPERIENCE"
      ariaLabel="Loading experience"
      widthClass="max-w-5xl"
    >
      <SkeletonCollapsibleRow />
      <SkeletonCollapsibleRow />
      <SkeletonCollapsibleRow />
      <SkeletonCollapsibleRow />
    </SkeletonShell>
  );
}
