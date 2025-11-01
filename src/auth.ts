// src/auth.ts
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import type { User } from "@auth/core/types";
import authConfig from "./auth.config";

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user || trigger === "update") {
        if (user) {
          token.profileComplete = (user as User).profileComplete;
          token.sub = user.id;
          token.email = user.email;
        }

        if (token.sub) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { id: token.sub },
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                profileComplete: true,
              },
            });

            if (dbUser) {
              token.name = dbUser.name;
              token.email = dbUser.email;
              token.picture = dbUser.image;
              token.profileComplete = dbUser.profileComplete;
            }
          } catch (error) {
            console.error("Error fetching user in JWT callback:", error);
          }
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.image = token.picture;
        session.user.profileComplete =
          (token.profileComplete as boolean) || false;
      }
      return session;
    },
  },

  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  ...authConfig,
});
