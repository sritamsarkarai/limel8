import { getProfileById } from "@/modules/profiles/queries";
import { IndividualProfileView } from "@/components/profiles/IndividualProfileView";
import { GroupProfileView } from "@/components/profiles/GroupProfileView";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [result, session] = await Promise.all([
    getProfileById(id),
    getServerSession(authOptions),
  ]);
  if (!result) return notFound();
  if (result.type === "profile") {
    return (
      <IndividualProfileView
        profile={result.data}
        currentProfileId={session?.user?.profileId ?? null}
      />
    );
  }
  return <GroupProfileView group={result.data} />;
}
