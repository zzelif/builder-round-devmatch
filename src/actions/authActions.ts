// src\actions\authActions.ts

"use server";

import { auth, signIn, signOut } from "@/auth";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { LoginSchema } from "@/lib/schemas/LoginSchema";
import {
  combinedRegisterSchema,
  ProfileDetailsSchema,
  RegisterSchema,
} from "@/lib/schemas/RegisterSchema";
import { generateToken, getTokenByToken } from "@/lib/tokens";
import { ActionResult } from "@/types";
import { TokenType, User } from "@/generated/prisma";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

export async function signInUser(
  data: LoginSchema
): Promise<ActionResult<string>> {
  try {
    const existingUser = await getUserByEmail(data.email);

    if (!existingUser || !existingUser.email)
      return { status: "error", error: "Invalid credentials" };

    if (!existingUser.emailVerified) {
      const { token, email } = await generateToken(
        existingUser.email,
        TokenType.VERIFICATION
      );

      await sendVerificationEmail(email, token);

      return {
        status: "error",
        error: "Please verify your email before logging in",
      };
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

    const verificationToken = await generateToken(
      email,
      TokenType.VERIFICATION
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { status: "success", data: user };
  } catch (error) {
    console.log(error);
    return { status: "error", error: "Something went wrong" };
  }
}

export async function verifyEmail(
  token: string
): Promise<ActionResult<string>> {
  try {
    const existingToken = await getTokenByToken(token);

    if (!existingToken) {
      return { status: "error", error: "Invalid token" };
    }

    const hasExpired = new Date() > existingToken.expires;

    if (hasExpired) {
      return { status: "error", error: "Token has expired" };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
      return { status: "error", error: "User not found" };
    }

    await prisma.user.update({
      where: { id: existingUser.id },
      data: { emailVerified: new Date() },
    });

    await prisma.token.delete({ where: { id: existingToken.id } });

    return { status: "success", data: "Success" };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function generateResetPasswordEmail(
  email: string
): Promise<ActionResult<string>> {
  try {
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return { status: "error", error: "Email not found" };
    }

    const token = await generateToken(email, TokenType.PASSWORD_RESET);

    await sendPasswordResetEmail(token.email, token.token);

    return {
      status: "success",
      data: "Password reset email has been sent.  Please check your emails",
    };
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

export async function resetPassword(
  password: string,
  token: string | null
): Promise<ActionResult<string>> {
  try {
    if (!token) return { status: "error", error: "Missing token" };

    const existingToken = await getTokenByToken(token);

    if (!existingToken) {
      return { status: "error", error: "Invalid token" };
    }

    const hasExpired = new Date() > existingToken.expires;

    if (hasExpired) {
      return { status: "error", error: "Token has expired" };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
      return { status: "error", error: "User not found" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: existingUser.id },
      data: { passwordHash: hashedPassword },
    });

    await prisma.token.delete({
      where: { id: existingToken.id },
    });

    return {
      status: "success",
      data: "Password updated successfully.  Please try logging in",
    };
  } catch (error) {
    console.log(error);
    return { status: "error", error: "Something went wrong" };
  }
}

export async function completeSocialLoginProfile(
  data: ProfileDetailsSchema
): Promise<ActionResult<string>> {
  const session = await auth();

  if (!session?.user) return { status: "error", error: "User not found" };

  try {
    const genderMapping = {
      male: "MALE",
      female: "FEMALE",
      "non-binary": "NON_BINARY",
      "prefer-not-to-say": "PREFER_NOT_TO_SAY",
    } as const;

    const existingMember = await prisma.member.findUnique({
      where: { userId: session.user.id },
    });

    if (existingMember) {
      const user = await prisma.user.update({
        where: { id: session.user.id },
        data: {
          profileComplete: true,
          member: {
            update: {
              name: data.name || (session.user.name as string),
              image: data.profileImageUrl || session.user.image,
              gender: genderMapping[data.gender],
              dateOfBirth: new Date(data.dateOfBirth),
              bio: data.bio,
              age: data.age,
              city: data.city,
              country: data.country,
              ...(data.profileImageUrl &&
                data.profileImagePublicId && {
                  photos: {
                    create: [
                      {
                        url: data.profileImageUrl,
                        publicId: data.profileImagePublicId,
                      },
                    ],
                  },
                }),
            },
          },
        },
        select: {
          accounts: {
            select: {
              provider: true,
            },
          },
        },
      });

      const provider = user.accounts?.[0]?.provider || "credentials";
      return { status: "success", data: provider };
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        profileComplete: true,
        member: {
          create: {
            name: data.name || (session.user.name as string),
            image: data.profileImageUrl || session.user.image,
            gender: genderMapping[data.gender],
            dateOfBirth: new Date(data.dateOfBirth),
            bio: data.bio,
            age: data.age,
            city: data.city,
            country: data.country,
            ...(data.profileImageUrl &&
              data.profileImagePublicId && {
                photos: {
                  create: [
                    {
                      url: data.profileImageUrl,
                      publicId: data.profileImagePublicId,
                    },
                  ],
                },
              }),
          },
        },
      },
      select: {
        accounts: {
          select: {
            provider: true,
          },
        },
      },
    });

    const provider = user.accounts?.[0]?.provider || "credentials";
    return { status: "success", data: provider };
  } catch (error) {
    console.error("Error completing profile:", error);
    return { status: "error", error: "Failed to complete profile" };
  }
}
