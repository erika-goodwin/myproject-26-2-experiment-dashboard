import type { Request, Response } from "express";
import { randomBytes } from "node:crypto";
import { pool } from "../db/index.js";
import { getAllExperiments } from "../services/experiments_service.js";

function generateAnonymousId(length = 21) {
  return randomBytes(length).toString("base64").slice(0, length);
}

// ⚠️ NEED A RULE
// “A user can only be assigned once per experiment.”

export async function getStatus(req: Request, res: Response) {
  // (1) Identify the user
  // -> (Exist anonymousId : check the storage on FrontEnd.)

  // Generate a New user
  // const anonymousId = generateAnonymousId(); // this should come with request normally
  // Existing scenario ✌️
  const anonymousId = "+ZWfUQi/TqEgy9LGT/Z/5";

  console.log("👍 anonymousId:", anonymousId);
  // 🛑 Later : Read this from cookie/header

  // === LOOP HERE ===
  // (2) Get an Experiment
  // - Get the list of experiments
  const experimentList = await getAllExperiments();

  console.log("👍 experimentList:", experimentList);

  // 🛑 LOOP HERE
  const experiment = experimentList[0];
  console.log("👍 experiment:", experiment);

  // (3) check if assignment already exists
  const assignments = await pool.query(
    "SELECT * FROM assignments WHERE anonymous_id = $1",
    [anonymousId],
  );

  if (assignments.rows) {
    const assinedVariant = assignments.rows[0].variant_id;
    console.log(
      ">>>> user already exist!!!!! | assinedVariant:",
      assinedVariant,
    );
    // return res.status(400).json({message: })
  }

  console.log("👍 assignments:", assignments.rows);

  // anonymous
  // (4) > YES : return
  // (4) > NO : check an experiment status

  // (5) >> NOT [Running] : return default (control)
  // (5) >> [Running] : procees

  // (6) Assign variant : Use number → modulo → variant index

  // (7) Insert to the table

  const data = {
    anonymous_id: anonymousId,
  };

  console.log(">>>>>data", data);
  res.json({ status: "okay" });
}

export async function getVariation(req: Request, res: Response) {
  res.json({ status: "okay" });
}
// export async function name(req: Request, res: Response) {
//   res.json({ status: "okay" });
// }
// export async function name(req: Request, res: Response) {
//   res.json({ status: "okay" });
// }
// export async function name(req: Request, res: Response) {
//   res.json({ status: "okay" });
// }
