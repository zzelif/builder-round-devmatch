// src/app/networks/[userId]/page.tsx

import { getMemberById } from "@/actions/memberActions";
import { CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";

export default async function MemberDetailedPage({
  params,
}: {
  params: { userId: string };
}) {
  const member = await getMemberById(params.userId);

  if (!member) return notFound;

  return (
    <>
      <CardHeader>Profile</CardHeader>
      <Separator />
      <CardContent>{member.bio}</CardContent>
    </>
  );
}
