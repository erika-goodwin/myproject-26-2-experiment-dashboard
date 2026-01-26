import z from "zod";

export const experimentCreateSchema = z.object({
  name: z.string().min(1, "Experiment name is required."),
  description: z.string().max(500, "Description is too long.").optional(),
  status: z.enum(["draft", "running", "paused"]),
});

export const experimentUpdateSchema = experimentCreateSchema.partial();
