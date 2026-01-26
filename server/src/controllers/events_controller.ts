import type { Request, Response } from "express";
import { getExperimentById } from "../services/experiments_service.js";
import {
  getVariantsByExperimentIdAndId,
  getVariantsById,
} from "../services/variants_cervise.js";
import { eventCreateSchema } from "../validators/event_schema.js";
import { createEvent } from "../services/events_service.js";

export async function postEvents(req: Request, res: Response) {
  console.log("🍊 postEvents", req.body);
  try {
    // Check event_type
    const parsed = eventCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Invalid Input", errors: parsed.error.format() });
    }

    const { experiments_id, anonymous_id, variant_id, event_type } =
      parsed.data;

    // Experiment exist?
    const experimentData = await getExperimentById(experiments_id);
    // console.log("🍊 experimentData", experimentData);
    if (experimentData === null) {
      return res.status(404).json({ message: "Experiment not found" });
    }

    // Variants is valid?
    const variantData = await getVariantsByExperimentIdAndId(
      experiments_id,
      variant_id,
    );
    // console.log("🍊 variantData", variantData);
    if (variantData.length === 0) {
      return res
        .status(400)
        .json({ message: "Variant does not belong to experiment" });
    }

    await createEvent(experiments_id, anonymous_id, variant_id, event_type);

    res.status(201).json({ message: "New Event created" });
  } catch (error) {
    console.error("DB error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
