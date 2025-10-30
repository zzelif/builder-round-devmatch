"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Photo } from "@prisma/client";
import { Member } from "@prisma/client";

export async function getMembers() {
  const session = await auth();

  if (!session?.user) return null;

  try {
    return prisma.member.findMany({
      where: {
        NOT: {
          userId: session.user.id,
        },
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getMemberById(userId: string) {
  try {
    return prisma.member.findUnique({
      where: { userId },
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getMemberPhotosByUserId(userId: string) {
  const member = await prisma.member.findUnique({
    where: { userId },
    select: { photos: true },
  });

  if (!member) return null;

  return member.photos.map((p) => p) as Photo[];
}

export async function getUndiscoveredMembers(
  currentUserId: string
): Promise<Member[]> {
  if (!currentUserId) {
    throw new Error("User ID is required");
  }

  try {
    const swipedMemberIds = await prisma.like.findMany({
      where: {
        sourceUserId: currentUserId,
      },
      select: {
        targetUserId: true,
      },
    });

    const swipedIds = swipedMemberIds.map((like) => like.targetUserId);

    const undiscoveredMembers = await prisma.member.findMany({
      where: {
        userId: {
          notIn: [...swipedIds, currentUserId],
        },
      },
      orderBy: {
        created: "desc",
      },
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
    if (isLike) {
      await prisma.like.create({
        data: {
          sourceUserId,
          targetUserId,
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error recording swipe:", error);
    return { success: false, error: "Failed to record swipe" };
  }
}
