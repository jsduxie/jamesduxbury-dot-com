'use client';

import { useState } from 'react';
import type { Degree } from '@/data/education';
import { DegreeCard } from './DegreeCard';

interface DegreeListProps {
  degrees: Degree[];
}

export const DegreeList: React.FC<DegreeListProps> = ({ degrees }) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <>
      {degrees.map((degree, i) => (
        <DegreeCard
          key={degree.qualification}
          degree={degree}
          open={openIndex === i}
          onToggle={() => setOpenIndex((prev) => (prev === i ? -1 : i))}
        />
      ))}
    </>
  );
};
