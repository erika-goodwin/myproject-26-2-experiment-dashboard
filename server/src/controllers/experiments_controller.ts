import type { Request, Response } from "express";
import { pool } from "../db/index.js";
import {
  experimentCreateSchema,
  experimentUpdateSchema,
} from "../validators/experiment_schema.js";
// import { validate as idUUID } from "uuid";

export async function getExperiments(req: Request, res: Response) {
  try {
    const result = await pool.query("SELECT * FROM experiments");
    res.json(result.rows);
  } catch (error) {
    console.error("DB error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getExperimentWithId(req: Request, res: Response) {
  const experimentId = req.params.experimentId;

  try {
    const result = await pool.query("SELECT * FROM experiments WHERE id = $1", [
      experimentId,
    ]);

    const experimentData = result.rows[0];
    if (!experimentData) {
      return res.status(404).json({ message: "Experiment not found" });
    }

    // console.log("👉 Data/result:", experimentData);
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

  const { name, description, status } = parsed.data;

  //   if (!name) {
  //     return res.status(401).json({ message: "Title is needed!" });
  //   }

  await pool.query(
    "INSERT INTO experiments (name, description, status) VALUES ($1, $2, $3)",
    [name, description, status],
  );

  res.status(201).json({ message: "New experiment Created" });
}

export async function putExperiments(req: Request, res: Response) {
  const parsed = experimentUpdateSchema.safeParse(req.body);
  //   console.log(">>>> HERE WE GO:", parsed);

  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: "Invalid Input", errors: parsed.error.format() });
  }

  const { name, description, status } = parsed.data;
  const experimentId = req.params.experimentId;
  const currentTimeStamp = new Date();

  //   console.log(">>>> currentTimeStamp:", currentTimeStamp);

  const fields = [];
  const values = [];
  let index = 1;

  fields.push(`updated_at = $${index++}`);
  values.push(currentTimeStamp);

  if (name) {
    fields.push(`name = $${index++}`);
    values.push(name);
  }
  if (description) {
    fields.push(`description = $${index++}`);
    values.push(description);
  }
  if (status) {
    fields.push(`status = $${index++}`);
    values.push(status);
  }

  values.push(experimentId);

  //   console.log("👉 fields:", fields);
  //   console.log("👉 values:", values);
  //   console.log("👉 index:", index);

  const sql = `UPDATE experiments SET ${fields.join(", ")} WHERE id = $${index}`;

  //   console.log("👉 putExperiments !!!!!!, sql:", sql);
  //   console.log("👉 putExperiments !!!!!!values:", values);

  try {
    await pool.query(sql, values);
    res.status(201).json({ message: "Experiment updated" });

    // await pool.query(
    //   "UPDATE experiments SET name = $1, description = $2, status = $3 WHERE id = $4",
    //   [name, description, status, experimentId],
    // );
  } catch (error) {
    console.error("DB error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteExperiments(req: Request, res: Response) {
  const experimentId = req.params.experimentId;
  console.log(">>>> experimentId:", experimentId);

  try {
    const result = await pool.query("SELECT * FROM experiments WHERE id = $1", [
      experimentId,
    ]);
    const experimentData = result.rows[0];

    if (!experimentData) {
      return res.status(404).json({ message: "Experiment not found" });
    }

    await pool.query("DELETE FROM experiments WHERE id = $1", [
      experimentData.id,
    ]);

    res.status(201).json({ message: "Item Deleted" });
  } catch (error) {
    console.error("DB error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
