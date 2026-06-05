import { notFound } from 'next/navigation';
import { saveItem } from '@/admin/actions';
import { formDefaults } from '@/admin/fields';
import { SECTIONS } from '@/admin/sections';
import { getRow } from '@/admin/sql';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { SectionForm } from '@/components/admin/SectionForm';

export default async function SectionEditPage({
  params,
}: {
  params: Promise<{ section: string; id: string }>;
}) {
  const { section: slug, id: idParam } = await params;
  const section = SECTIONS.find((s) => s.slug === slug);
  if (!section || !/^\d+$/.test(idParam)) notFound();

  const id = Number(idParam);
  const row = await getRow(section.table, id);
  if (!row) notFound();

  return (
    <AdminPanel title={`${section.title.toLowerCase()} · edit`} meta={section.listLabel(row)}>
      <SectionForm
        fields={section.fields}
        defaults={formDefaults(section.fields, row)}
        action={saveItem.bind(null, section.slug, id)}
        submitLabel="save →"
      />
    </AdminPanel>
  );
}
