import type { Request, Response } from "express";
import { randomBytes } from "node:crypto";
import { pool } from "../db/index.js";
import { getAllExperiments } from "../services/experiments_service.js";
import { getVariantsByExperimentId } from "../services/variants_route.js";
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
  const totalAssignments = assignments.length || 1;

  const actualCount: Record<string, number> = {}; // {id: number, id:number, ...}
  for (const variant of variantsList) {
    actualCount[variant.id] = 0;
  }

  for (const assignment of assignments) {
    if (actualCount[assignment.variant_id] !== undefined) {
      actualCount[assignment.variant_id]++;
    }
  }
  console.log("👈 actualCount2:", actualCount);

  let bestVariant: Variant | null = null;
  let maxDeficit = -Infinity;

  for (const variant of variantsList) {
    const expectedRate = totalAssignments * (Number(variant.weight) / 100);

    const actualRate = actualCount[variant.id] || 0;

    const deficit = expectedRate - actualRate;

    if (deficit > maxDeficit) {
      maxDeficit = deficit;
      bestVariant = variant;
    }
  }

  if (!bestVariant) {
    console.error("Failed to resolve variant");
  }

  return bestVariant!;
}

// ⚠️ NEED A RULE
// “A user can only be assigned once per experiment.”
export async function getStatus(req: Request, res: Response) {
  try {
    // (1) Identify the user
    // -> (Exist anonymousId : check the storage on FrontEnd.)

    // > Generate a New user
    const anonymousId = generateAnonymousId(); // this should come with request normally
    // > Existing scenario ✌️
    // const anonymousId = "+ZWfUQi/TqEgy9LGT/Z/5";

    console.log("👍 anonymousId:", anonymousId);
    // 🛑 Later : Read this from cookie/header

    // === LOOP HERE ===
    // (2) Get an Experiment
    // - Get the list of experiments
    const experimentList = await getAllExperiments();

    console.log("👍 experimentList:", experimentList);

    const resultsOfAll: {
      experiment_id: string;
      isExist: boolean;
      status?: string;
      variant?: string;
      variant_id?: string;
    }[] = [];

    for (const experiment of experimentList) {
      console.log("🛑 LOOP HERE");
      // 🛑 LOOP HERE
      // const experiment = experimentList[0];
      const experimentId = experiment.id;
      // console.log("👍 experimentId:", experimentId);

      // (3) check if assignment already exists
      const assignments = await pool.query(
        "SELECT * FROM assignments WHERE anonymous_id = $1 AND experiments_id = $2",
        [anonymousId, experimentId],
      );
      // console.log("👑 assignments:", assignments.rows);

      // anonymous
      // (4) > YES : return
      if (assignments.rows.length !== 0) {
        const assignedVariantData = assignments.rows[0];
        const variantId = assignedVariantData.variant_id;

        console.log("✋✋✋ user already assigned", experiment);

        const status = {
          experiment_id: experimentId,
          isExist: true,
          // status: "paused",
          // variant: "control",
          variant_id: variantId,
        };

        resultsOfAll.push(status);
        console.log("✅ return1️⃣ : status", status);

        continue;
      }

      // (4) > NO : check an experiment status
      console.log("👌 User is NOT exist YET");
      const isRunning = experiment.status === "running";

      console.log("🏃‍♂️ Status is running ?", isRunning);

      // (5) >> NOT [Running] : return default (control)
      // (5) >> [Running] : proceeds
      if (!isRunning) {
        // What should I return here???
        console.log("✋ Experiment is not running");

        const status = {
          experiment_id: experimentId,
          isExist: false,
          status: experiment.status,
          variant: "control",
          // variant_id: variantId,
        };

        resultsOfAll.push(status);
        console.log("✅ return 2️⃣ : status", status);

        continue;
      }

      // (6) Assign variant : Use number → modulo → variant index
      // console.log("👌 experimentId:", experimentId);
      const variantsList = await getVariantsByExperimentId(experimentId);
      const assignmentsList = await getAssignmentsByExperimentId(experimentId);

      const assigningVariant = pickVariantByWeight(
        variantsList,
        assignmentsList,
      );
      console.log("👌 assigningVariant:", assigningVariant);

      if (!assigningVariant) {
        res.status(400).json({ message: "assigning variant couldn't find." });
      }

      const status = {
        experiment_id: experimentId,
        isExist: false,
        status: experiment.status,
        variant: assigningVariant.name,
        variant_id: assigningVariant.id,
      };

      resultsOfAll.push(status);

      console.log("✅ return 3️⃣ : status", status);
      // (7) Insert to the table
      await createAssignment(experimentId, anonymousId, assigningVariant.id);

      continue;
    }

    const dataToReturn = {
      anonymous_id: anonymousId,
      assignments: resultsOfAll,
    };
    console.log("🌻 all:", dataToReturn);

    // Case 1 — Existing assignment
    // Case 2 — New user + running experiment
    // Case 3 — Experiment not running

    res.json(dataToReturn);
  } catch (error) {
    console.error("DB error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
// ==== RETURN OF getStatus =====
// 🌻 all: {
//   anonymous_id: 'yehVLcwqmeHWFzsn0Kpa4',
//   assigments: [
//     {
//       experiment_id: '44fef021-8364-4dd9-9ee1-ed4c20226fa5',
//       isExist: false,
//       status: 'running',
//       variant: 'running',
//       variant_id: 'c0f37e2a-a47d-42e3-b9c6-4bb7314e11a6'
//     },
//     {
//       experiment_id: '88d6dc0c-7144-4e9d-8bf6-ed80d09e3cfd',
//       isExist: false,
//       status: 'running',
//       variant: 'running',
//       variant_id: 'b4fe754c-2257-4fd6-bee3-ea640cce8990'
//     },
//     {
//       experiment_id: '94200ad9-b963-458a-9c89-d51ae105ee65',
//       isExist: false,
//       status: 'draft',
//       variant: 'control'
//     },
//     {
//       experiment_id: '7fffdf88-013b-4e19-be14-00bfa71537a9',
//       isExist: false,
//       status: 'running',
//       variant: 'running',
//       variant_id: '837914df-32eb-4098-a4ab-e0bcb2d290e1'
//     },
//     {
//       experiment_id: 'db6fbcdd-5c76-4348-9123-680c5cec1b7b',
//       isExist: false,
//       status: 'draft',
//       variant: 'control'
//     },
//     {
//       experiment_id: '145073f3-0074-4186-9fe6-372f5f995843',
//       isExist: false,
//       status: 'draft',
//       variant: 'control'
//     }
//   ]
// }

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
