import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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
    <div className="min-h-screen bg-cyber-bg">
      <TopProgress />
      <Sidebar />
      <Header />
      <main
        className="min-h-screen pt-16"
        style={{ marginLeft: "256px" }}
      >
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
