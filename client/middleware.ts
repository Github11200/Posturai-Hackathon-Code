import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const { isAuthenticated, getAccessTokenRaw } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  const accessToken = await getAccessTokenRaw();
  const baseUrl = process.env.KINDE_ISSUER_URL;

  const res = await fetch(`${baseUrl}/account_api/v1/entitlements`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });
  const payload = await res.json();
  const plans = payload?.data?.plans ?? [];

  // If they aren't paying then redirect them back to the homepage
  if (plans.length == 0 || plans[0].subscribed_on === null)
    return NextResponse.redirect(new URL('/payment', request.url))

  return withAuth(request);
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/session',
    '/dashboard/session/statistics',
    '/dashboard/session/[id]',
    '/dashboard/sessions',
    '/dashboard/settings',
    '/dashboard/posture',
    '/dashboard/posturai'
  ],
};
