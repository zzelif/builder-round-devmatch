// src\actions\userActions.ts

"use server";

import { ActionResult } from "@/types";
import { Member, Photo } from "@/generated/prisma";
import { getAuthUserId } from "./authActions";
import { prisma } from "@/lib/prisma";
import { editSchema, EditSchema } from "@/lib/schemas/EditSchema";
import { cloudinary } from "@/lib/cloudinary";

export async function updateMemberProfile(
  data: EditSchema,
  nameUpdated: boolean
): Promise<ActionResult<Member>> {
  try {
    const userId = await getAuthUserId();
    const validated = editSchema.safeParse(data);

    if (!validated.success)
      return { status: "error", error: validated.error.issues };

    const { name, gender, city, country, bio } = validated.data;

    if (nameUpdated) {
      await prisma.user.update({
        where: { id: userId },
        data: { name },
      });
    }

    const genderMapping = {
      male: "MALE",
      female: "FEMALE",
      "non-binary": "NON_BINARY",
      "prefer-not-to-say": "PREFER_NOT_TO_SAY",
    } as const;

    const member = await prisma.member.update({
      where: { userId },
      data: {
        name,
        gender: genderMapping[gender],
        city,
        country,
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

export async function setMainImage(photo: Photo) {
  try {
    const userId = await getAuthUserId();

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: { image: photo.url },
    });

    return prisma.member.update({
      where: {
        userId,
      },
      data: {
        image: photo.url,
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteImage(photo: Photo) {
  try {
    const userId = await getAuthUserId();

    if (photo.publicId) {
      await cloudinary.v2.uploader.destroy(photo.publicId);
    }

    return prisma.member.update({
      where: { userId },
      data: {
        photos: {
          delete: { id: photo.id },
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
