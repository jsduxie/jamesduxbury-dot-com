import { notFound } from 'next/navigation';
import { saveItem } from '@/admin/actions';
import { formDefaults } from '@/admin/fields';
import { SECTIONS } from '@/admin/sections';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { SectionForm } from '@/components/admin/SectionForm';

export default async function SectionNewPage({ params }: { params: Promise<{ section: string }> }) {
  const { section: slug } = await params;
  const section = SECTIONS.find((s) => s.slug === slug);
  if (!section) notFound();

  return (
    <AdminPanel title={`${section.title.toLowerCase()} · new`}>
      <SectionForm
        fields={section.fields}
        defaults={formDefaults(section.fields)}
        action={saveItem.bind(null, section.slug, null)}
        submitLabel="create →"
      />
    </AdminPanel>
  );
}
