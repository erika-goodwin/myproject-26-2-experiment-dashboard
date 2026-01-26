import type { Request, Response } from "express";
import { randomBytes } from "node:crypto";
import { pool } from "../db/index.js";
import { getAllExperiments } from "../services/experiments_service.js";
import {
  getVariantsByExperimentId,
  getVariantsById,
} from "../services/variants_route.js";
import {
  createAssignment,
  getAssignmentsByExperimentId,
} from "../services/result_service.js";
import { Assignment, Variant } from "../types/result.js";

function generateAnonymousId(length = 21) {
  return randomBytes(length).toString("base64").slice(0, length);
}

function pickVariantByWeight(
  variantsList: Variant[],
  assignments: Assignment[],
) {
  console.log("👈 assignments:", assignments);
  const totalAssignments = assignments.length || 1;
  console.log("👈 totalAssignments:", totalAssignments);

  const actualCount: Record<string, number> = {}; // {id: number, id:number, ...}
  for (const variant of variantsList) {
    actualCount[variant.id] = 0;
  }

  console.log("👈 actualCount1:", actualCount);

  for (const assignment of assignments) {
    if (actualCount[assignment.variant_id] !== undefined) {
      actualCount[assignment.variant_id]++;
    }
  }

  console.log("👈 actualCount2:", actualCount);

  let bestVariant: Variant | null = null;
  let maxDeficit = -Infinity;
  console.log("👈 maxDeficit:", maxDeficit);

  for (const variant of variantsList) {
    console.log("👈 for loop | variant:", variant.name);
    const expectedRate = totalAssignments * (Number(variant.weight) / 100);
    console.log("👈 for loop | expected:", expectedRate);

    const actualRate = actualCount[variant.id] || 0;
    console.log("👈 for loop | actualRate:", actualRate);
    const deficit = expectedRate - actualRate;
    console.log("👈 for loop | deficit:", deficit);

    if (deficit > maxDeficit) {
      console.log("👈 for loop | condition: deficit > maxDeficit");
      maxDeficit = deficit;
      bestVariant = variant;

      console.log(
        "👈 for loop | condition: deficit > maxDeficit | maxDeficit:",
        maxDeficit,
      );
      console.log(
        "👈 for loop | condition: deficit > maxDeficit | bestVariant:",
        bestVariant,
      );
    }
  }

  if (!bestVariant) {
    // throw new Error("Failed to resolve variant");
    console.error("Failed to resolve variant");
  }

  return bestVariant!;

  // const totalWeight = variantsList.reduce(
  //   (sum, v) => sum + Number(v.weight),
  //   0,
  // );

  // console.log("👈 totalWeight:", totalWeight); //99.99 100

  // const random = Math.random() * totalWeight; //22.71370354664802
  // console.log("👈 random:", random);

  // let cumulative = 0;
  // for (const variant of variantsList) {
  //   console.log("👈 FOR LOOP", variant);
  //   cumulative += Number(variant.weight);
  //   console.log("👈 FOR LOOP | cumulative:", cumulative);
  //   if (random <= cumulative) {
  //     console.log("👈 FOR LOOP | IF | ", variant);
  //     return variant;
  //   }
  // }

  // return variantsList[variantsList.length - 1];
}

// ⚠️ NEED A RULE
// “A user can only be assigned once per experiment.”
export async function getStatus(req: Request, res: Response) {
  try {
    // (1) Identify the user
    // -> (Exist anonymousId : check the storage on FrontEnd.)

    // Generate a New user
    const anonymousId = generateAnonymousId(); // this should come with request normally
    // Existing scenario ✌️
    // const anonymousId = "+ZWfUQi/TqEgy9LGT/Z/5";

    console.log("👍 anonymousId:", anonymousId);
    // 🛑 Later : Read this from cookie/header

    // === LOOP HERE ===
    // (2) Get an Experiment
    // - Get the list of experiments
    const experimentList = await getAllExperiments();

    console.log("👍 experimentList:", experimentList);

    // 🛑 LOOP HERE
    const experiment = experimentList[0];
    const experimentId = experiment.id;
    console.log("👍 experiment:", experiment);

    // (3) check if assignment already exists
    const assignments = await pool.query(
      "SELECT * FROM assignments WHERE anonymous_id = $1",
      [anonymousId],
    );

    console.log(
      "👍 assignments:",
      assignments.rows,
      assignments.rows.length !== 0,
    );

    // anonymous
    // (4) > YES : return
    if (assignments.rows.length !== 0) {
      const assignedVariantData = assignments.rows[0];
      const variantId = assignedVariantData.variant_id;

      console.log("✋ user already exist!!!!! | variantId:", variantId);

      // const resultVariantData = await getVariantsById(variantId);

      // console.log("🙌 resultVariantData:", resultVariantData);
      // // return res.status(400).json({message: })

      return res.json({ variant_id: variantId });
    }

    // (4) > NO : check an experiment status
    console.log("👌 User is NOT exist YET");
    const isRunning = experiment.status === "running";

    console.log("🏃‍♂️ Status is running ?", isRunning);

    // (5) >> NOT [Running] : return default (control)
    if (!isRunning) {
      // What should I return here???
      console.log("✋ Experiment is not running");
      // return res.json({variant});
    }
    // (5) >> [Running] : proceeds

    // (6) Assign variant : Use number → modulo → variant index
    console.log("👌 experimentId:", experimentId);
    // const variantsList = await pool.query(
    //   "SELECT * FROM variants WHERE experiments_id = $1 ORDER BY name",
    //   [experimentId],
    // );
    const variantsList = await getVariantsByExperimentId(experimentId);
    const assignmentsList = await getAssignmentsByExperimentId(experimentId);

    console.log("👌 variantsList:", variantsList);
    console.log("👌 assignmentsList:", assignmentsList);

    const assigningVariant = pickVariantByWeight(variantsList, assignmentsList);
    console.log("👌 assigningVariant:", assigningVariant);

    if (!assigningVariant) {
      res.status(400).json({ message: "assigning variant couldn't find." });
    }

    // const assignment = {
    //   experiments_id: experiment.id,
    //   anonymous_id: anonymousId,
    //   variant_id: assigningVariant.id,
    // };
    console.log("✨ assignment", {
      experiments_id: experiment.id,
      anonymous_id: anonymousId,
      variant_id: assigningVariant.id,
    });

    // (7) Insert to the table
    await createAssignment(experiment.id, anonymousId, assigningVariant.id);

    res.status(201).json({ message: "New assignment Created" });
  } catch (error) {
    console.error("DB error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
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
