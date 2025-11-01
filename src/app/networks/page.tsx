// src\app\networks\page.tsx
import React from "react";
import { auth } from "@/auth";
import { getUndiscoveredMembers } from "@/actions/likeActions";
import SwipeInterface from "./SwipeInterface";
import { redirect } from "next/navigation";

export default async function networksPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const members = await getUndiscoveredMembers(session.user.id);
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto pt-8">
        <SwipeInterface
          initialMembers={members}
          currentUserId={session.user.id}
        />
      </div>
    </div>
  );
}
