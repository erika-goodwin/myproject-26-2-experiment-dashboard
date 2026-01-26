import type { Request, Response } from "express";
import { pool } from "../db/index.js";
import {
  experimentCreateSchema,
  experimentUpdateSchema,
} from "../validators/experiment_schema.js";
import {
  createExperiment,
  deleteExperiment,
  getAllExperiments,
  getExperimentById,
  updateExperiment,
} from "../services/experiments_service.js";

// Bearer XXXXXXXX
export async function getExperiments(req: Request, res: Response) {
  pool;
  try {
    const experiments = await getAllExperiments();
    res.json(experiments);
  } catch (error) {
    console.error("DB error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getExperimentId(req: Request, res: Response) {
  const experimentId = req.params.experimentId as string;

  try {
    const experimentData = await getExperimentById(experimentId);
    if (!experimentData) {
      return res.status(404).json({ message: "Experiment not found" });
    }

    res.json(experimentData);
  } catch (error) {
    console.error("DB error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function postExperiments(req: Request, res: Response) {
  // Parsing Data
  const parsed = experimentCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: "Invalid Input", errors: parsed.error.format() });
  }

  await createExperiment(parsed.data);

  res.status(201).json({ message: "New experiment Created" });
}

export async function putExperiments(req: Request, res: Response) {
  const parsed = experimentUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: "Invalid Input", errors: parsed.error.format() });
  }

  const experimentId = req.params.experimentId as string;
  const currentTimeStamp = new Date();

  const fields = [];
  const values = [];

  fields.push(`updated_at = $${values.length + 1}`);
  values.push(currentTimeStamp);

  for (const [key, value] of Object.entries(parsed.data)) {
    fields.push(`${key} = $${values.length + 1}`);
    values.push(value);
  }

  try {
    await updateExperiment(experimentId, fields, values);

    res.status(201).json({ message: "Experiment updated" });
  } catch (error) {
    console.error("DB error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteExperiments(req: Request, res: Response) {
  const experimentId = req.params.experimentId as string;

  try {
    const experimentData = await getExperimentById(experimentId);

    if (!experimentData) {
      return res.status(404).json({ message: "Experiment not found" });
    }

    await deleteExperiment(experimentId);

    res.status(201).json({ message: "Item Deleted" });
  } catch (error) {
    console.error("DB error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
