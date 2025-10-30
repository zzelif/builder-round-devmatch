import { z } from "zod";

export const editSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name is required",
    })
    .max(50, "Name must be less tha 50 characters"),
  age: z
    .number("Age is required")
    .int("Age must be a whole number")
    .min(18, "You must be at least 18 years old")
    .max(120, "Please enter a valid age"),
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio must be less than 500 characters"),
  // city: z.string().min(1, {
  //   message: "City is required",
  // }),
  // country: z.string().min(1, {
  //   message: "Country is required",
  // }),
});

export type EditSchema = z.infer<typeof editSchema>;
