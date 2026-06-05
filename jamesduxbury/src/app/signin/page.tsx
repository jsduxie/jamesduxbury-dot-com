import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth, signIn } from '@/auth';

export const metadata: Metadata = {
  title: 'Sign in · James Duxbury',
  robots: { index: false },
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  if (session) redirect('/admin');
  const { callbackUrl, error } = await searchParams;

  return (
    <main className="mx-auto max-w-md px-4 pb-10 pt-28 sm:px-6 sm:pt-32">
      <Link
        href="/"
        className="mb-8 inline-block font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
      >
        ← / home
      </Link>

      <div className="border border-border bg-surface/40 backdrop-blur-sm">
        <div className="border-b border-border px-4 py-5 sm:px-6">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            {`>`} restricted channel · operator access only
          </p>
        </div>
        <div className="flex flex-col gap-4 px-4 py-5 sm:px-6">
          {error && (
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-danger">
              {`>`}{' '}
              {error === 'AccessDenied'
                ? 'access denied · account not authorised'
                : 'sign-in failed · try again'}
            </p>
          )}
          <form
            action={async () => {
              'use server';
              await signIn('github', { redirectTo: callbackUrl ?? '/admin' });
            }}
          >
            <button
              type="submit"
              className="w-full rounded-full border border-accent bg-accent/10 px-5 py-2 font-mono text-sm uppercase tracking-[0.18em] text-accent transition-colors hover:bg-accent hover:text-text"
            >
              sign in with github →
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
