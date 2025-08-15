import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  // Skip checks on the landing page
  // if (request.nextUrl.pathname === '/' || request.nextUrl.pathname === "/api/auth/register") {
  //   return NextResponse.next();
  // }

  // const { isAuthenticated, getAccessTokenRaw } = getKindeServerSession();

  // if (!(await isAuthenticated())) {
  //   return NextResponse.redirect(new URL('/', request.url));
  // }

  // const accessToken = await getAccessTokenRaw();
  // const baseUrl = process.env.KINDE_ISSUER_URL;

  // // Check payment status (entitlements)
  // const res = await fetch(`${baseUrl}/account_api/v1/entitlements`, {
  //   headers: { Authorization: `Bearer ${accessToken}` },
  //   cache: 'no-store',
  // });
  // const payload = await res.json();
  // const plans = payload?.data?.plans ?? [];

  // console.log(plans);

  // if (plans.length === 0) {
  //   // If user hasn't paid, redirect to logout or payment page
  //   return NextResponse.redirect(new URL('/api/auth/logout', request.url));
  // }

  // User is authenticated and has paid, continue to the requested page
  return NextResponse.next();
}

// Define routes where middleware applies, excluding landing page
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|^$).*)'],
};
