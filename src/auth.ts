import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

import authConfig from "./auth.config";

import { PrismaClient } from "./generated/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  providers: [GitHub],
});
