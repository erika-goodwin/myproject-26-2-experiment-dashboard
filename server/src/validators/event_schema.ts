import z from "zod";

export const eventCreateSchema = z.object({
  experiments_id: z.string().min(1, "Experiment ID is required."),
  anonymous_id: z.string().min(1, "Anonymous ID is required."),
  variant_id: z.string().min(1, "Variant ID is required."),
  event_type: z.enum(["click", "view", "conversion"]),
});

export const experimentUpdateSchema = eventCreateSchema.partial();
