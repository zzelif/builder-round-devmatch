// \src\auth.config.ts

// import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { loginSchema } from "./lib/schemas/LoginSchema";
import { getUserByEmail } from "./actions/authActions";
import { compare } from "bcryptjs";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
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

          return user;
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
