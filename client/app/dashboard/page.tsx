import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./sidebar";
import StatsOverview from "./stats-overview";

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
      <SidebarProvider defaultOpen>
        <DashboardSidebar avatarUrl={data.picture} />
        <main className="w-full p-4 min-w-0">
          <SidebarTrigger />
          <div className="flex flex-col items-center w-full gap-6 min-w-0">
            <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance mx-auto">
              Welcome {data.given_name}!
            </h1>
            <div className="container mx-auto w-full max-w-6xl min-w-0">
              <StatsOverview />
            </div>
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
