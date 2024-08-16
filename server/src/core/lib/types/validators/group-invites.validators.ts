import { z } from "zod";

export const CreateGroupInputValidator = z.object({
  name: z.string().min(3),
});
