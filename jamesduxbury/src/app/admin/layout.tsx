import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth, isAdminSession } from '@/auth';
import { SECTIONS } from '@/admin/sections';

// admin pages always render fresh
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin · James Duxbury',
  robots: { index: false },
};

const navLink =
  'font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!(await isAdminSession(session))) redirect('/signin');

  return (
    <div className="mx-auto max-w-5xl px-4 pb-10 pt-28 sm:px-6 sm:pt-32">
      <nav className="mb-8 flex flex-wrap gap-x-5 gap-y-2">
        <Link href="/admin" className={navLink}>
          admin
        </Link>
        {SECTIONS.map((section) => (
          <Link key={section.slug} href={`/admin/${section.slug}`} className={navLink}>
            {section.title.toLowerCase()}
          </Link>
        ))}
        <Link href="/admin/messages" className={navLink}>
          messages
        </Link>
        <Link href="/admin/analytics" className={navLink}>
          analytics
        </Link>
        <Link href="/signout" className={`${navLink} ml-auto`}>
          sign out
        </Link>
      </nav>
      {children}
    </div>
  );
}
