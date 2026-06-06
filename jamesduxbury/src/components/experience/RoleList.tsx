'use client';

import { useState } from 'react';
import type { Role } from '@/data/experience';
import { RoleCard } from './RoleCard';

interface RoleListProps {
  roles: Role[];
}

export const RoleList: React.FC<RoleListProps> = ({ roles }) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <>
      {roles.map((role, i) => (
        <RoleCard
          key={`${role.organisation}-${role.period}`}
          role={role}
          open={openIndex === i}
          onToggle={() => setOpenIndex((prev) => (prev === i ? -1 : i))}
        />
      ))}
    </>
  );
};
