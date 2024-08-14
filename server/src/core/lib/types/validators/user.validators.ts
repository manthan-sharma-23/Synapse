import { z } from "zod";

export const UserValidator = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(5),
});
