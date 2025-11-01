// src/app/lists/page.tsx

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

  const [likedMembers, whoLikedMe, mutualMatches] = await Promise.all([
    fetchLikedMembers(userId, "source"),
    fetchLikedMembers(userId, "target"),
    fetchLikedMembers(userId, "mutual"),
  ]);

  const serializedData = {
    likedMembers: JSON.parse(JSON.stringify(likedMembers)),
    whoLikedMe: JSON.parse(JSON.stringify(whoLikedMe)),
    mutualMatches: JSON.parse(JSON.stringify(mutualMatches)),
    currentUserId: userId,
  };

  return (
    <div className="min-h-screen bg-background">
      <ListsTab
        likedMembers={serializedData.likedMembers}
        whoLikedMe={serializedData.whoLikedMe}
        mutualMatches={serializedData.mutualMatches}
        currentUserId={userId}
      />
    </div>
  );
}
