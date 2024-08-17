import { z } from "zod";

export const UserValidator = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(5),
});

export const UpdateUserProfileValidator = z.object({
  name: z.string().optional().nullable().default(null),
  username: z.string(),
  url: z.string().optional().nullable().default(null),
});
