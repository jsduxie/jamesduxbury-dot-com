import Link from 'next/link';
import { SECTIONS } from '@/admin/sections';
import { countRows } from '@/admin/sql';
import { getMessageCounts, getVisitTotals } from '@/db/analytics';

export default async function AdminPage() {
  const [counts, messages, visits] = await Promise.all([
    Promise.all(SECTIONS.map((section) => countRows(section.table))),
    getMessageCounts(),
    getVisitTotals(),
  ]);

  const cards = [
    ...SECTIONS.map((section, i) => ({
      href: `/admin/${section.slug}`,
      title: section.title,
      meta: `${counts[i]} ${counts[i] === 1 ? 'row' : 'rows'}`,
    })),
    {
      href: '/admin/messages',
      title: 'Messages',
      meta: `${messages.unread} unread · ${messages.total} total`,
    },
    {
      href: '/admin/analytics',
      title: 'Analytics',
      meta: `${visits.last7Days} views / 7d · ${visits.allTime} all-time`,
    },
    {
      href: '/admin/maintenance',
      title: 'Maintenance',
      meta: 'heal and purge stored blobs',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          className="group border border-border bg-surface/40 px-4 py-5 backdrop-blur-sm transition-colors hover:border-accent sm:px-6"
        >
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-text transition-colors group-hover:text-accent">
            {card.title}
          </p>
          <p className="mt-2 font-mono text-xs text-muted">{card.meta}</p>
        </Link>
      ))}
    </div>
  );
}
