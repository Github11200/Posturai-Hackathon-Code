import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "../../components/dashboard/sidebar";
import StatsOverview from "../../components/dashboard/stats-overview";
import { db, SettingsInterface } from "@/lib/db";

export default async function Dashboard() {
  const { isAuthenticated, getAccessTokenRaw } = getKindeServerSession();
  if (!(await isAuthenticated())) redirect("/api/auth/login");

  const accessToken = await getAccessTokenRaw();
  const baseUrl = process.env.KINDE_ISSUER_URL;

  const data = await fetch(`${baseUrl}/oauth2/v2/user_profile`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => {
    return res.json();
  });

  return (
    <div className="h-screen w-full max-w-full min-w-0">
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance mx-auto mb-6">
        Welcome {data.given_name}!
      </h1>
      <div className="container mx-auto w-full max-w-6xl min-w-0 pb-8">
        <StatsOverview />
      </div>
    </div>
  );
}
