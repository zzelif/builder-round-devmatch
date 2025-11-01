// \src\auth.config.ts

import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { loginSchema } from "./lib/schemas/LoginSchema";
import { getUserByEmail } from "./actions/authActions";
import { compare } from "bcryptjs";
import type { User } from "@auth/core/types";

const isDev = process.env.NODE_ENV === "development";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          profileComplete: false,
        };
      },
    }),
    GitHub({
      clientId: isDev
        ? process.env.GITHUB_CLIENT_ID
        : process.env.GITHUB_CLIENT_ID_DEP,
      clientSecret: isDev
        ? process.env.GITHUB_CLIENT_SECRET
        : process.env.GITHUB_CLIENT_SECRET_DEP,
      profile(profile): User & { profileComplete: boolean } {
        return {
          id: profile.id.toString(),
          name: profile.name,
          email: profile.email,
          profileComplete: false,
        };
      },
    }),
    Credentials({
      async authorize(credentials) {
        try {
          const validated = loginSchema.safeParse(credentials);

          if (!validated.success) {
            return null;
          }

          const { email, password } = validated.data;
          const user = await getUserByEmail(email);

          if (!user?.passwordHash) return null;

          const passwordsMatch = await compare(password, user.passwordHash);

          if (!passwordsMatch) return null;

          return {
            ...user,
            profileComplete: user.profileComplete,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;
