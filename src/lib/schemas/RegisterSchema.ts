// src/lib/schemas/RegisterSchema.ts
import { z } from "zod";

export const userDetailsSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .pipe(z.email("Please enter a valid email address")),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password is too long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const profileDetailsSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  age: z
    .number("Age is required")
    .int("Age must be a whole number")
    .min(18, "You must be at least 18 years old")
    .max(120, "Please enter a valid age"),
  gender: z.enum(["male", "female", "non-binary", "prefer-not-to-say"], {
    error: "Please select your gender",
  }),
  dateOfBirth: z.date({
    error: "Date of birth is required",
  }),
  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(100, "City name is too long"),
  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .max(100, "Country name is too long"),
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio must be less than 500 characters"),

  profileImageUrl: z.string().optional(),
  profileImagePublicId: z.string().optional(),
});

export const combinedRegisterSchema =
  userDetailsSchema.and(profileDetailsSchema);

export type UserDetailsSchema = z.infer<typeof userDetailsSchema>;
export type ProfileDetailsSchema = z.infer<typeof profileDetailsSchema>;
export type RegisterSchema = z.infer<typeof combinedRegisterSchema>;
