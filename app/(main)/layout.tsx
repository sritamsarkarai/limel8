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
    <div className="min-h-screen flex flex-col">
      <Navbar profile={profile} />
      <div className="flex flex-1">
        <Sidebar profile={profile} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
