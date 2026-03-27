import { getProfileById } from "@/modules/profiles/queries";
import { IndividualProfileView } from "@/components/profiles/IndividualProfileView";
import { GroupProfileView } from "@/components/profiles/GroupProfileView";
import { notFound } from "next/navigation";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getProfileById(id);
  if (!result) return notFound();
  if (result.type === "profile") return <IndividualProfileView profile={result.data} />;
  return <GroupProfileView group={result.data} />;
}
