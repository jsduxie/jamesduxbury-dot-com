import { neon } from '@neondatabase/serverless';
import { afterEach, describe, expect, it } from 'vitest';
import type { Session } from 'next-auth';
import type { NextRequest } from 'next/server';
import type { JWT } from 'next-auth/jwt';
import {
  auth,
  authCallbacks,
  handlers,
  isAdminSession,
  isAllowedLogin,
  signIn,
  signOut,
} from '../src/auth';
import { config, requireAdmin } from '../src/middleware';
import { GET, POST } from '../src/app/api/auth/[...nextauth]/route';

type AuthedRequest = Parameters<typeof requireAdmin>[0];

const sql = neon(process.env.DATABASE_URL!);

function request(href: string, session: Session | null): AuthedRequest {
  const url = new URL(href);
  return { auth: session, nextUrl: url } as NextRequest & { auth: Session | null };
}

function sessionFor(login?: string): Session {
  return { user: { name: 'James', login }, expires: '2099-01-01T00:00:00.000Z' };
}

// the allowlist lives in the dev DB now; every mutation restores it
afterEach(async () => {
  await sql`UPDATE site_settings SET admin_login = 'jsduxie' WHERE id = 1`;
});

describe('allowlist', () => {
  it('allows exactly the stored login', async () => {
    expect(await isAllowedLogin('jsduxie')).toBe(true);
  });

  it.each(['JSDuxie', 'jsduxie2', 'octocat', '', undefined, null, 42])(
    'rejects %j',
    async (login) => {
      expect(await isAllowedLogin(login)).toBe(false);
    },
  );

  it('follows a rename: the old login is rejected and the new one accepted', async () => {
    await sql`UPDATE site_settings SET admin_login = 'renamed-user' WHERE id = 1`;
    expect(await isAllowedLogin('jsduxie')).toBe(false);
    expect(await isAllowedLogin('renamed-user')).toBe(true);
  });

  it('fails closed on an empty stored value', async () => {
    await sql`UPDATE site_settings SET admin_login = '' WHERE id = 1`;
    expect(await isAllowedLogin('jsduxie')).toBe(false);
    expect(await isAllowedLogin('')).toBe(false);
  });
});

describe('isAdminSession', () => {
  it('accepts only a session carrying the allowed login', async () => {
    expect(await isAdminSession(sessionFor('jsduxie'))).toBe(true);
    expect(await isAdminSession(sessionFor('octocat'))).toBe(false);
    expect(await isAdminSession(sessionFor(undefined))).toBe(false);
    expect(await isAdminSession(null)).toBe(false);
  });
});

describe('NextAuth wiring', () => {
  it('exports route handlers and helpers', () => {
    expect(GET).toBe(handlers.GET);
    expect(POST).toBe(handlers.POST);
    expect(typeof auth).toBe('function');
    expect(typeof signIn).toBe('function');
    expect(typeof signOut).toBe('function');
  });

  it('signIn admits only the allowed GitHub profile', async () => {
    expect(await authCallbacks.signIn({ profile: { login: 'jsduxie' } })).toBe(true);
    expect(await authCallbacks.signIn({ profile: { login: 'octocat' } })).toBe(false);
    expect(await authCallbacks.signIn({})).toBe(false);
  });

  it('jwt stores the login at sign-in and keeps it afterwards', () => {
    const signedIn = authCallbacks.jwt({ token: {}, profile: { login: 'jsduxie' } });
    expect(signedIn.login).toBe('jsduxie');
    // later requests carry no profile
    expect(authCallbacks.jwt({ token: signedIn }).login).toBe('jsduxie');
  });

  it('session exposes only a string login claim', () => {
    const run = (token: JWT) =>
      authCallbacks.session({ session: sessionFor(undefined), token }).user?.login;
    expect(run({ login: 'jsduxie' })).toBe('jsduxie');
    expect(run({})).toBeUndefined();
    expect(run({ login: 42 })).toBeUndefined();
  });
});

describe('admin middleware', () => {
  it('guards exactly the admin subtree', () => {
    expect(config.matcher).toEqual(['/admin/:path*']);
  });

  it('lets the allowed account through', async () => {
    expect(
      await requireAdmin(request('http://localhost:3000/admin/projects', sessionFor('jsduxie'))),
    ).toBeUndefined();
  });

  it.each([
    ['anonymous', null],
    ['wrong account', sessionFor('octocat')],
    ['session without a login claim', sessionFor(undefined)],
  ])('redirects a %s request to signin with a callback', async (_name, session) => {
    const res = await requireAdmin(request('http://localhost:3000/admin/projects', session));
    expect(res).toBeInstanceOf(Response);
    const location = new URL(res!.headers.get('location')!);
    expect(location.pathname).toBe('/signin');
    expect(location.searchParams.get('callbackUrl')).toBe('http://localhost:3000/admin/projects');
  });
});
