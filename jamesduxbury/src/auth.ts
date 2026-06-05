import NextAuth, { type Profile, type Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import GitHub from 'next-auth/providers/github';

declare module 'next-auth' {
  interface User {
    login?: string;
  }
}

// github account allowed to sign in
export const ALLOWED_LOGIN = 'jsduxie';

export function isAllowedLogin(login: unknown): boolean {
  return login === ALLOWED_LOGIN;
}

export function isAdminSession(session: Session | null): boolean {
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
