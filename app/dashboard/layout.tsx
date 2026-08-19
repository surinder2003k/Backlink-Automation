import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardProviders } from "@/components/layout/dashboard-providers";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { TopProgress } from "@/components/top-progress";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const auth = cookieStore.get("xylos_auth");

  if (!auth || auth.value !== "authenticated") {
    redirect("/login");
  }

  return (
    <DashboardProviders>
      <div className="min-h-screen bg-cyber-bg grid-bg">
        <TopProgress />
        <Sidebar />
        <Header />
        <main
          className="min-h-screen pt-16 lg:pl-64"
          style={{ marginLeft: "0" }}
        >
          <div className="p-4 lg:p-8 animate-fade-in-up">{children}</div>
        </main>
      </div>
    </DashboardProviders>
  );
}