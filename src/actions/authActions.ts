"use server";

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { LoginSchema } from "@/lib/schemas/LoginSchema";
import {
  combinedRegisterSchema,
  RegisterSchema,
} from "@/lib/schemas/RegisterSchema";
import { ActionResult } from "@/types";
import { User } from "@/generated/prisma";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

export async function signInUser(
  data: LoginSchema
): Promise<ActionResult<string>> {
  try {
    const existingUser = await getUserByEmail(data.email);

    if (!existingUser || !existingUser.passwordHash) {
      return { status: "error", error: "Invalid credentials" };
    }

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
    }
    return { status: "error", error: "Something else went wrong" };
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

    const { name, email, password, bio } = validated.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) return { status: "error", error: "User already exists" };

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        member: {
          create: {
            name,
            bio,
            // profilePicture,
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
