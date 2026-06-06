'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SectionHeader } from './console/SectionHeader';
import { SpecRow } from './console/SpecRow';
import { StatusChip } from './console/StatusChip';

export const Entry: React.FC = () => {
  return (
    <section id="entry" className="w-full pt-20 sm:pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader channel="00" label="ENTRY" />

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-12">
          <div className="relative h-36 w-36 overflow-hidden border border-border sm:h-40 sm:w-40 lg:h-44 lg:w-44">
            <Image
              src="/images/profile-picture.png"
              alt="James Duxbury"
              fill
              sizes="(max-width: 640px) 144px, 176px"
              className="object-cover transition duration-300"
              priority
            />
            {/* corner marks */}
            <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-accent" />
            <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-accent" />
            <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-accent" />
            <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-accent" />
          </div>

          {/* spec rows */}
          <div className="divide-y divide-border border-y border-border">
            <SpecRow label="Name" trailing={<StatusChip kind="live" label="ACTIVE" />}>
              <span className="font-mono text-base text-text sm:text-lg">James Duxbury</span>
              <span className="ml-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
                AfCIIS
              </span>
            </SpecRow>

            <SpecRow label="Role">Software engineer · AI &amp; application security</SpecRow>

            <SpecRow label="Education">
              Durham University · Integrated MEng Computer Science
            </SpecRow>

            <SpecRow
              label="Years"
              trailing={<span className="font-mono text-xs text-muted">FINAL YEAR</span>}
            >
              <span className="font-mono">2022 — 2026</span>
            </SpecRow>

            <SpecRow
              label="CV"
              trailing={
                <Link
                  href="/data/CV.pdf"
                  download="James_Duxbury_CV.pdf"
                  className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-accent transition-colors hover:text-danger"
                >
                  download
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                    ↗
                  </span>
                </Link>
              }
            >
              <span className="font-mono text-muted">cv.pdf</span>
            </SpecRow>
          </div>
        </div>
      </div>
    </section>
  );
};
