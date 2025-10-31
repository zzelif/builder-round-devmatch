// src\actions\authActions.ts

"use server";

import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { LoginSchema } from "@/lib/schemas/LoginSchema";
import {
  combinedRegisterSchema,
  RegisterSchema,
} from "@/lib/schemas/RegisterSchema";
import { ActionResult } from "@/types";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

export async function signInUser(
  data: LoginSchema
): Promise<ActionResult<string>> {
  try {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    return { status: "success", data: "Logged in" };
  } catch (error) {
    console.log(error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { status: "error", error: "Invalid credentials" };
        default:
          return { status: "error", error: "Something went wrong" };
      }
    } else {
      return { status: "error", error: "Something else went wrong" };
    }
  }
}

export async function signOutUser() {
  await signOut({ redirectTo: "/" });
}

export async function registerUser(
  data: RegisterSchema
): Promise<ActionResult<User>> {
  try {
    const validated = combinedRegisterSchema.safeParse(data);

    if (!validated.success) {
      return { status: "error", error: validated.error.issues };
    }

    const {
      email,
      password,
      profileImageUrl,
      profileImagePublicId,
      ...profileData
    } = validated.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) return { status: "error", error: "User already exists" };

    const genderMapping = {
      male: "MALE",
      female: "FEMALE",
      "non-binary": "NON_BINARY",
      "prefer-not-to-say": "PREFER_NOT_TO_SAY",
    } as const;

    const user = await prisma.user.create({
      data: {
        name: profileData.name,
        email,
        passwordHash: hashedPassword,
        image: profileImageUrl || null,
        profileComplete: true,
        member: {
          create: {
            name: profileData.name,
            bio: profileData.bio,
            age: profileData.age,
            dateOfBirth: profileData.dateOfBirth,
            gender: genderMapping[profileData.gender],
            city: profileData.city,
            country: profileData.country,
            image: profileImageUrl || null,
            ...(profileImageUrl &&
              profileImagePublicId && {
                photos: {
                  create: [
                    {
                      url: profileImageUrl,
                      publicId: profileImagePublicId,
                    },
                  ],
                },
              }),
          },
        },
      },
    });

    return { status: "success", data: user };
  } catch (error) {
    console.log(error);
    return { status: "error", error: "Something went wrong" };
  }
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getAuthUserId() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("Unauthorized");

  return userId;
}
