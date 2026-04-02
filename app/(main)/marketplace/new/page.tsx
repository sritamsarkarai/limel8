import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ListingForm } from "@/components/marketplace/ListingForm";

export default async function NewListingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent mb-6" style={{ fontFamily: "var(--font-heading)" }}>Create Listing</h1>
      <ListingForm />
    </main>
  );
}
