import type { Request, Response } from "express";
import { pool } from "../db/index.js";

export async function getVariants(req: Request, res: Response) {
  try {
    const result = await pool.query("SELECT * FROM variants");
    res.json(result.rows);
  } catch (error) {
    console.error("DB error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getVariantsWithExperimentId(req: Request, res: Response) {
  const experimentId = req.params.experimentId;
  // console.log(">>>>experimentId", experimentId);
  try {
    const result = await pool.query(
      "SELECT * FROM variants WHERE experiments_id = $1 ORDER BY name",
      [experimentId],
    );

    console.log(">>>>result", result.rows);

    const experimentData = result.rows;
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
  //  // Parsing Data
  //   const parsed = experimentCreateSchema.safeParse(req.body);
  //   if (!parsed.success) {
  //     return res
  //       .status(400)
  //       .json({ message: "Invalid Input", errors: parsed.error.format() });
  //   }

  const { experiments_id, names } = req.body;

  if (!Array.isArray(names) || names.length === 0) {
    return res
      .status(400)
      .json({ message: "Names must be a non-empty array." });
  }

  const numberOfNames = names.length;
  const weight = Number((100 / numberOfNames).toFixed(2));

  try {
    await Promise.all(
      names.map((name: string) => {
        console.log(">>>>> map", [experiments_id, name, weight]);
        return pool.query(
          "insert into variants (experiments_id, name, weight) VALUES ($1, $2, $3)",
          [experiments_id, name, weight],
        );
      }),
    );

    res.status(201).json({ message: "New Variants created" });
  } catch (error) {
    console.error("DB error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteVariants(req: Request, res: Response) {
  const experimentId = req.params.experimentId;
  // console.log(">>>> experimentId:", experimentId);

  const result = await pool.query(
    "SELECT * FROM variants WHERE experiments_id = $1 ORDER BY name",
    [experimentId],
  );

  // console.log(">>>>result", result.rows);

  const experimentData = result.rows;
  if (experimentData.length === 0) {
    return res.status(404).json({ message: "Variants not found" });
  }

  // console.log(">>>>experimentData", experimentData);
  try {
    await Promise.all(
      experimentData.map((data) => {
        console.log(">>>> deleting this:", data, data.id);
        return pool.query("DELETE FROM variants WHERE id = $1", [data.id]);
      }),
    );
    res.status(201).json({ message: "Item Deleted" });
  } catch (error) {
    console.error("DB error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
