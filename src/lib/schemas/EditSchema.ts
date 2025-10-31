import { z } from "zod";

export const editSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name is required",
    })
    .max(50, "Name must be less tha 50 characters"),
  gender: z.enum(
    ["male", "female", "non-binary", "prefer-not-to-say"],
    "Please select your gender"
  ),
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio must be less than 500 characters"),
  city: z
    .string()
    .min(2, "City must be at least 4 characters")
    .max(100, "City name is too long"),
  country: z
    .string()
    .min(2, "Country must be at least 4 characters")
    .max(100, "Country name is too long"),
});

export type EditSchema = z.infer<typeof editSchema>;
