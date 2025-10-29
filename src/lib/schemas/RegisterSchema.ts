import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters"),
    age: z
      .number("Age is required")
      .int("Age must be a whole number")
      .min(18, "You must be at least 18 years old")
      .max(120, "Please enter a valid age"),
    bio: z
      .string()
      .min(10, "Bio must be at least 10 characters")
      .max(500, "Bio must be less than 500 characters"),
    profilePicture: z
      .instanceof(File, { message: "Profile picture is required" })
      .refine(
        (file) => file.size <= MAX_FILE_SIZE,
        "Profile picture must be less than 5MB"
      )
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported"
      ),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .pipe(z.email("Please enter a valid email address")),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
