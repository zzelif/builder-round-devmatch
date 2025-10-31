// src/app/networks/[userId]/page.tsx

import { getMemberById } from "@/actions/memberActions";
import CardInnerWrapper from "@/components/CardInnerWrapper";
import { notFound } from "next/navigation";

export default async function MemberDetailedPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const resolvedParams = await params;
  const member = await getMemberById(resolvedParams.userId);

  if (!member) return notFound;

  return (
    <CardInnerWrapper
      header="Profile"
      body={<div className="flex">{member.bio}</div>}
    ></CardInnerWrapper>
  );
}
