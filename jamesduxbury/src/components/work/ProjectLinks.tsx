import Link from 'next/link';

export const projectLinkClass =
  'inline-flex items-center gap-1 text-accent transition-colors hover:text-danger';

interface ProjectLinksProps {
  githubLink?: string;
  liveLink?: string;
  children?: React.ReactNode;
}

export function ProjectLinks({ githubLink, liveLink, children }: ProjectLinksProps) {
  if (!githubLink && !liveLink && !children) return null;
  return (
    <div className="mt-4 flex flex-wrap items-center gap-4 font-mono text-xs">
      {children}
      {githubLink && (
        <Link
          href={githubLink}
          target="_blank"
          rel="noopener noreferrer"
          className={projectLinkClass}
        >
          view repo ↗
        </Link>
      )}
      {liveLink && (
        <Link
          href={liveLink}
          target="_blank"
          rel="noopener noreferrer"
          className={projectLinkClass}
        >
          open live ↗
        </Link>
      )}
    </div>
  );
}
