// src\app\networks\[userId]\layout.tsx

import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getMemberById } from "@/actions/memberActions";
import { Card } from "@/components/ui/card";
import MemberSidebar from "../MemberSidebar";
import { checkMutualMatch } from "@/actions/likeActions";
import { auth } from "@/auth";

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ userId: string }>;
}) {
  const resolvedParams = await params;
  const session = await auth();

  if (!session?.user?.id) {
    notFound();
  }

  const member = await getMemberById(resolvedParams.userId);

  if (!member) return notFound();

  const hasMatch = await checkMutualMatch(session.user.id, member.userId);

  const basePath = `/networks/${member.userId}`;

  const navLinks = [
    { name: "Profile", href: `${basePath}` },
    { name: "Photos", href: `${basePath}/photos` },
    { name: "Message", href: `${basePath}/chat`, locked: !hasMatch },
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="lg:sticky lg:top-20">
            <MemberSidebar
              member={member}
              navLinks={navLinks}
              hasMatch={hasMatch}
            />
          </div>
        </div>
        <div className="lg:col-span-8 xl:col-span-9">
          <Card className="h-[calc(100vh-6rem)] flex flex-col">{children}</Card>
        </div>
      </div>
    </div>
  );
}
