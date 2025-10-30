import React, { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getMemberById } from "@/actions/memberActions";
import { Card } from "@/components/ui/card";
import MemberSidebar from "../MemberSidebar";

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ userId: string }>;
}) {
  const resolvedParams = await params;

  const member = await getMemberById(resolvedParams.userId);
  if (!member) return notFound();

  const basePath = `/networks/${member.userId}`;

  const navLinks = [
    { name: "Profile", href: `${basePath}` },
    { name: "Photos", href: `${basePath}/photos` },
    { name: "Message", href: `${basePath}/message` },
  ];

  return (
    <div className="grid grid-cols-12 gap-5 h-[80vh]">
      <div className="col-span-3">
        <MemberSidebar member={member} navLinks={navLinks} />
      </div>
      <div className="col-span-9">
        <Card className="w-full mt-10 h-[80vh]">{children}</Card>
      </div>
    </div>
  );
}
