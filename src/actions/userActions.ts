"use server";

import { ActionResult } from "@/types";
import { Member, Photo } from "@prisma/client";
import { getAuthUserId } from "./authActions";
import { prisma } from "@/lib/prisma";
import { editSchema, EditSchema } from "@/lib/schemas/EditSchema";

export async function updateMemberProfile(
  data: EditSchema,
  nameUpdated: boolean
): Promise<ActionResult<Member>> {
  try {
    const userId = await getAuthUserId();
    const validated = editSchema.safeParse(data);

    if (!validated.success)
      return { status: "error", error: validated.error.issues };

    const { name, bio } = validated.data;

    if (nameUpdated) {
      await prisma.user.update({
        where: { id: userId },
        data: { name },
      });
    }

    const member = await prisma.member.update({
      where: { userId },
      data: {
        name,
        bio,
      },
    });
    return { status: "success", data: member };
  } catch (error) {
    console.log(error);

    return { status: "error", error: "Something went wrong" };
  }
}

export async function addImage(url: string, publicId: string) {
  try {
    const userId = await getAuthUserId();

    return prisma.member.update({
      where: { userId },
      data: {
        photos: {
          create: [
            {
              url,
              publicId,
            },
          ],
        },
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserInfoForNav() {
  try {
    const userId = await getAuthUserId();
    return prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, image: true },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
