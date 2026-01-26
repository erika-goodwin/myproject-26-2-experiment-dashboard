import type { Request, Response } from "express";
import {
  createVariants,
  deleteByExperimentId,
  getAllVariants,
  getVariantsByExperimentId,
} from "../services/variants_service.js";

export async function getVariants(req: Request, res: Response) {
  try {
    const result = await getAllVariants();
    res.json(result);
  } catch (error) {
    console.error("DB error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getVariantsWithExperimentId(req: Request, res: Response) {
  const experimentId = req.params.experimentId as string;

  try {
    const experimentData = await getVariantsByExperimentId(experimentId);
    if (experimentData.length === 0) {
      return res.status(404).json({ message: "Variants not found" });
    }

    res.json({ experiments_id: experimentId, variants: experimentData });
  } catch (error) {
    console.error("DB error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// request BODY
// {
//     "experiments_id": "44fef021-8364-4dd9-9ee1-ed4c20226fa5",
//     "names": ["A", "B"]
// }
export async function postVariants(req: Request, res: Response) {
  const { experiments_id, names } = req.body;

  if (!Array.isArray(names) || names.length === 0) {
    return res
      .status(400)
      .json({ message: "Names must be a non-empty array." });
  }

  try {
    await createVariants(experiments_id, names);
    res.status(201).json({ message: "New Variants created" });
  } catch (error) {
    console.error("DB error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteVariants(req: Request, res: Response) {
  try {
    const experimentId = req.params.experimentId as string;
    const experimentData = await getVariantsByExperimentId(experimentId);
    if (experimentData.length === 0) {
      return res.status(404).json({ message: "Variants not found" });
    }

    await deleteByExperimentId(experimentData);
    res.status(201).json({ message: "Item Deleted" });
  } catch (error) {
    console.error("DB error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
