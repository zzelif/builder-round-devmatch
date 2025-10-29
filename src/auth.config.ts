import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { loginSchema } from "./lib/schemas/LoginSchema";
import { getUserByEmail } from "./actions/authActions";
import { compare } from "bcryptjs";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    GitHub,
    Credentials({
      name: "credentials",
      async authorize(creds) {
        const validated = loginSchema.safeParse(creds);

        if (validated.success) {
          const { email, password } = validated.data;

          const user = await getUserByEmail(email);

          if (
            !user ||
            !user.passwordHash ||
            !(await compare(password, user.passwordHash))
          )
            return null;

          return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
