import Image from 'next/image';
import Link from 'next/link';
import { certifications } from '@/data/certifications';

const Card: React.FC<(typeof certifications)[number]> = ({
  name,
  year,
  imgPath,
  certificationLink,
}) => {
  const inner = (
    <div className="flex items-center gap-3 border border-border bg-bg/40 p-3 transition-colors hover:border-accent">
      {imgPath ? (
        <Image
          src={imgPath}
          alt={name}
          width={48}
          height={48}
          className="h-12 w-12 flex-shrink-0 rounded-sm object-cover"
        />
      ) : (
        <span
          aria-hidden
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-sm border border-border bg-surface font-mono text-[0.6rem] uppercase tracking-[0.15em] text-accent"
        >
          AfCIIS
        </span>
      )}
      <div className="flex-1">
        <p className="text-sm leading-tight text-text">{name}</p>
        <p className="font-mono text-xs text-muted">{year}</p>
      </div>
    </div>
  );

  if (certificationLink) {
    return (
      <Link href={certificationLink} target="_blank" rel="noopener noreferrer" className="block">
        {inner}
      </Link>
    );
  }
  return inner;
};

export const CertificationsBlock: React.FC = () => (
  <div className="border-t border-border bg-bg/40 px-4 py-5 sm:px-6">
    <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
      Certifications & memberships / {certifications.length}
    </p>
    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
      {certifications.map((cert) => (
        <Card key={cert.name} {...cert} />
      ))}
    </div>
  </div>
);
