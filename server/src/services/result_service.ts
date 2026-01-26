import { pool } from "../db/index.js";

export async function getAssignmentsByExperimentId(experimentId: string) {
  const result = await pool.query(
    "SELECT * FROM assignments WHERE experiments_id = $1",
    [experimentId],
  );

  return result.rows ?? null;
}

export async function createAssignment(
  experiments_id: string,
  anonymous_id: string,
  variant_id: string,
) {
  await pool.query(
    "insert into assignments (experiments_id, anonymous_id, variant_id) VALUES ($1, $2, $3)",
    [experiments_id, anonymous_id, variant_id],
  );
}
