import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Header from "@/app/dashboard/header";
import dynamic from "next/dynamic";

// Use dynamic import to avoid SSR issues with Recharts (client-only)
const PostureChart = dynamic(() => import("./posture-chart"), { ssr: false });

export default async function Dashboard() {
  const { isAuthenticated, getAccessTokenRaw } = getKindeServerSession();
  if (!(await isAuthenticated())) redirect("/api/auth/login");

  const accessToken = await getAccessTokenRaw();
  const baseUrl = process.env.KINDE_ISSUER_URL;

  // TODO: Make sure to comment this back in to make sure they've paid
  // const res = await fetch(`${baseUrl}/account_api/v1/entitlements`, {
  //   headers: {
  //     Authorization: `Bearer ${accessToken}`,
  //   },
  //   cache: "no-store",
  // });
  // const payload = await res.json();
  // const plans = payload?.data?.plans ?? [];

  // if (plans.length == 0)
  //   // If they aren't paying then redirect them
  //   redirect("/api/auth/logout");

  const avatarUrl = await fetch(`${baseUrl}/oauth2/v2/user_profile`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data.picture;
    });

  return (
    <div className="space-y-6 flex h-screen items-center justify-center">
      <Header avatarUrl={avatarUrl} />
      <Button>Start Session</Button>
      <section className="w-[50%]">
        <h2 className="mb-2 text-sm font-medium text-muted-foreground">
          Weekly good posture
        </h2>
        <PostureChart />
      </section>
    </div>
  );
}
