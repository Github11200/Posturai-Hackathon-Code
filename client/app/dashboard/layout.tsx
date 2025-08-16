import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "../../components/dashboard/sidebar";
import StatsOverview from "../../components/dashboard/stats-overview";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <SidebarProvider defaultOpen>
        <DashboardSidebar avatarUrl={data.picture} />
        <main className="w-full p-4 min-w-0">
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
