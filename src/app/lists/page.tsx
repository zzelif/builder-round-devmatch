// src/app/lists/page.tsx
import React from "react";
import ListsTab from "./ListsTab";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { fetchLikedMembers } from "@/actions/likeActions";

export default async function ListPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Fetch all data in parallel for better performance
  const [likedMembers, whoLikedMe, mutualMatches] = await Promise.all([
    fetchLikedMembers(userId, "source"),
    fetchLikedMembers(userId, "target"),
    fetchLikedMembers(userId, "mutual"),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <ListsTab
        likedMembers={likedMembers}
        whoLikedMe={whoLikedMe}
        mutualMatches={mutualMatches}
      />
    </div>
  );
}
