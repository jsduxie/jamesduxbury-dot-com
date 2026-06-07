import NextAuth, { type Profile, type Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import GitHub from 'next-auth/providers/github';
import { getAdminLogin } from '@/db/queries';

declare module 'next-auth' {
  interface User {
    login?: string;
  }
}

// the login lives in site_settings, so a rename invalidates old sessions at once
export async function isAllowedLogin(login: unknown): Promise<boolean> {
  if (typeof login !== 'string' || login === '') return false;
  return login === (await getAdminLogin());
}

export async function isAdminSession(session: Session | null): Promise<boolean> {
  return isAllowedLogin(session?.user?.login);
}

export const authCallbacks = {
  signIn({ profile }: { profile?: Profile }) {
    return isAllowedLogin(profile?.login);
  },
  jwt({ token, profile }: { token: JWT; profile?: Profile }) {
    if (typeof profile?.login === 'string') token.login = profile.login;
    return token;
  },
  session({ session, token }: { session: Session; token: JWT }) {
    if (session.user)
      session.user.login = typeof token.login === 'string' ? token.login : undefined;
    return session;
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/signin', error: '/signin' },
  callbacks: authCallbacks,
});
