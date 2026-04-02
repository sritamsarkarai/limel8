import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getProfileByUserId } from "@/modules/profiles/queries";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const profile = await getProfileByUserId(session.user.id);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <Navbar profile={profile} />
      <div className="flex flex-1 min-h-0">
        <Sidebar profile={profile} />
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
