// src\app\networks\edit\layout.tsx

import { ReactNode } from "react";
import { getMemberById } from "@/actions/memberActions";
import { getAuthUserId } from "@/actions/authActions";
import MemberSidebar from "../MemberSidebar";
import { Card } from "@/components/ui/card";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: ReactNode }) {
  const userId = await getAuthUserId();

  const member = await getMemberById(userId);
  if (!member) {
    redirect("/register");
  }

  const basePath = `/networks/edit`;

  const navLinks = [
    { name: "Edit Profile", href: `${basePath}` },
    {
      name: "Update Photos",
      href: `${basePath}/photos`,
    },
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
              hasMatch={false}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-8 xl:col-span-9">
          <Card className="min-h-[600px]">{children}</Card>
        </div>
      </div>
    </div>
  );
}
