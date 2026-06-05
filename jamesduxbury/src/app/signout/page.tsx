import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth, signOut } from '@/auth';

export const metadata: Metadata = {
  title: 'Sign out · James Duxbury',
  robots: { index: false },
};

export default async function SignOutPage() {
  const session = await auth();
  if (!session) redirect('/');

  return (
    <main className="mx-auto max-w-md px-4 pb-10 pt-28 sm:px-6 sm:pt-32">
      <Link
        href="/admin"
        className="mb-8 inline-block font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
      >
        ← / admin
      </Link>

      <div className="border border-border bg-surface/40 backdrop-blur-sm">
        <div className="border-b border-border px-4 py-5 sm:px-6">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            {`>`} end session · {session.user?.name ?? 'operator'}
          </p>
        </div>
        <div className="px-4 py-5 sm:px-6">
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/' });
            }}
          >
            <button
              type="submit"
              className="w-full rounded-full border border-danger bg-danger/10 px-5 py-2 font-mono text-sm uppercase tracking-[0.18em] text-danger transition-colors hover:bg-danger hover:text-text"
            >
              sign out →
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
