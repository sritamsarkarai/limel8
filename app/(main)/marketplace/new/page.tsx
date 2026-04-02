import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ListingForm } from "@/components/marketplace/ListingForm";

export default async function NewListingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Create Listing</h1>
      <ListingForm />
    </main>
  );
}
