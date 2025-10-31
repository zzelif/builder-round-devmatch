// src/actions/likeActions.ts (NEW FILE - following reference pattern)
"use server";

import { prisma } from "@/lib/prisma";
import { Member } from "@prisma/client";
import { pusherServer } from "@/lib/pusher";

export async function getUndiscoveredMembers(
  currentUserId: string
): Promise<Member[]> {
  if (!currentUserId) {
    throw new Error("User ID is required");
  }

  try {
    // Swiped members

    const swipedMemberIds = await prisma.like.findMany({
      where: {
        sourceUserId: currentUserId,
      },
      select: {
        targetUserId: true,
      },
    });

    const swipedIds = swipedMemberIds.map((like) => like.targetUserId);

    // Not swiped yet

    const undiscoveredMembers = await prisma.member.findMany({
      where: {
        userId: {
          notIn: [...swipedIds, currentUserId],
        },
      },
      orderBy: {
        created: "desc",
      },
      take: 50,
    });

    return undiscoveredMembers;
  } catch (error) {
    console.error("Error fetching undiscovered members:", error);
    return [];
  }
}

export async function recordSwipe(
  sourceUserId: string,
  targetUserId: string,
  isLike: boolean
) {
  try {
    // Only likes
    //     if (isLike) {
    //       await prisma.like.create({
    //         data: {
    //           sourceUserId,
    //           targetUserId,
    //         },
    //       });
    //     }

    //     return { success: true };
    //   } catch (error) {
    //     console.error("Error recording swipe:", error);
    //     return { success: false, error: "Failed to record swipe" };
    //   }

    if (!isLike) {
      return { success: true, isMatch: false };
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        sourceUserId_targetUserId: {
          sourceUserId,
          targetUserId,
        },
      },
    });

    if (existingLike) {
      return { success: true, isMatch: false, message: "Already Liked" };
    }

    const like = await prisma.like.create({
      data: {
        sourceUserId,
        targetUserId,
      },
      include: {
        sourceMember: {
          select: {
            name: true,
            image: true,
            userId: true,
          },
        },
      },
    });

    await pusherServer.trigger(`private-${targetUserId}`, "like:new", {
      name: like.sourceMember.name,
      image: like.sourceMember.image,
      userId: like.sourceMember.userId,
    });

    const isMatch = await prisma.like.findUnique({
      where: {
        sourceUserId_targetUserId: {
          sourceUserId: targetUserId,
          targetUserId: sourceUserId,
        },
      },
    });

    return {
      success: true,
      isMatch: !!isMatch,
      message: isMatch ? "It's a match! " : "Follow sent!",
    };
  } catch (error) {
    console.error("Error recording swipe: ", error);
    return { success: false, error: "Failed to record swipe" };
  }
}

export async function getCurrentUserLikedIds(sourceUserId: string) {
  try {
    const likedIds = await prisma.like.findMany({
      where: {
        sourceUserId,
      },
      select: {
        targetUserId: true,
      },
    });

    return likedIds.map((like) => like.targetUserId);
  } catch (error) {
    console.error("Error fetching like Ids: ", error);
    return [];
  }
}

export async function fetchLikedMembers(
  currentUserId: string,
  type: "source" | "target" | "mutual" = "source"
) {
  try {
    switch (type) {
      case "source":
        return await fetchSourceLikes(currentUserId);
      case "target":
        return await fetchTargetLikes(currentUserId);
      case "mutual":
        return await fetchMutualLikes(currentUserId);
      default:
        return [];
    }
  } catch (error) {
    console.error("Error fetching liked members:", error);
    return [];
  }
}

async function fetchSourceLikes(userId: string) {
  const sourceList = await prisma.like.findMany({
    where: { sourceUserId: userId },
    select: { targetMember: true },
  });
  return sourceList.map((x) => x.targetMember);
}

async function fetchTargetLikes(userId: string) {
  const targetList = await prisma.like.findMany({
    where: { targetUserId: userId },
    select: { sourceMember: true },
  });
  return targetList.map((x) => x.sourceMember);
}

async function fetchMutualLikes(userId: string) {
  const likedUsers = await prisma.like.findMany({
    where: { sourceUserId: userId },
    select: { targetUserId: true },
  });
  const likedIds = likedUsers.map((x) => x.targetUserId);

  const mutualList = await prisma.like.findMany({
    where: {
      AND: [{ targetUserId: userId }, { sourceUserId: { in: likedIds } }],
    },
    select: { sourceMember: true },
  });
  return mutualList.map((x) => x.sourceMember);
}
