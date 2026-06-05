import Link from 'next/link';
import { notFound } from 'next/navigation';
import { deleteItem } from '@/admin/actions';
import { SECTIONS } from '@/admin/sections';
import { listRows } from '@/admin/sql';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { DeleteButton } from '@/components/admin/DeleteButton';

export default async function SectionListPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section: slug } = await params;
  const section = SECTIONS.find((s) => s.slug === slug);
  if (!section) notFound();

  const rows = await listRows(section.table);

  return (
    <AdminPanel title={section.title.toLowerCase()} meta={`${rows.length} rows`}>
      <div className="divide-y divide-border">
        {rows.map((row) => (
          <div key={row.id} className="flex items-center gap-4 px-4 py-4 sm:px-6">
            <span className="font-mono text-xs text-muted/70">#{String(row.sort_order)}</span>
            <Link
              href={`/admin/${section.slug}/${row.id}`}
              className="min-w-0 flex-1 truncate font-mono text-sm text-text transition-colors hover:text-accent"
            >
              {section.listLabel(row)}
            </Link>
            <DeleteButton action={deleteItem.bind(null, section.slug, row.id)} />
          </div>
        ))}
        {rows.length === 0 && (
          <p className="px-4 py-5 font-mono text-xs uppercase tracking-[0.18em] text-muted sm:px-6">
            {`>`} no rows
          </p>
        )}
        <div className="px-4 py-4 sm:px-6">
          <Link
            href={`/admin/${section.slug}/new`}
            className="font-mono text-xs uppercase tracking-[0.18em] text-accent transition-colors hover:text-text"
          >
            + new {section.title.toLowerCase().replace(/s$/, '')}
          </Link>
        </div>
      </div>
    </AdminPanel>
  );
}
