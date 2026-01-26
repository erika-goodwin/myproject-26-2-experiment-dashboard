import z from "zod";

export const eventCreateSchema = z.object({
  //   id: z.uuid(),
  experiments_id: z.string().min(1, "Experiment ID is required."),
  anonymous_id: z.string().min(1, "Anonymous ID is required."),
  variant_id: z.string().min(1, "Variant ID is required."),
  event_type: z.enum(["click", "view", "conversion"]),
  //   created_at: z.iso.datetime(),
});

export const experimentUpdateSchema = eventCreateSchema.partial();
