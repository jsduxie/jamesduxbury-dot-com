import { auth, isAdminSession } from '@/auth';
import type { Session } from 'next-auth';
import type { NextRequest } from 'next/server';

type AuthedRequest = NextRequest & { auth: Session | null };

export async function requireAdmin(req: AuthedRequest): Promise<Response | undefined> {
  if (await isAdminSession(req.auth)) return undefined;
  const url = new URL('/signin', req.nextUrl.origin);
  url.searchParams.set('callbackUrl', req.nextUrl.href);
  return Response.redirect(url);
}

export default auth(requireAdmin);

export const config = { matcher: ['/admin/:path*'] };
