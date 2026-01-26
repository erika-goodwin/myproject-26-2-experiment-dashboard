import { pool } from "../db/index.js";

export async function getAllExperiments() {
  const result = await pool.query(
    "SELECT * FROM experiments ORDER BY created_at",
  );
  return result.rows;
}

export async function getExperimentById(experimentId: string) {
  const result = await pool.query("SELECT * FROM experiments WHERE id = $1", [
    experimentId,
  ]);

  return result.rows[0] ?? null;
}

export async function createExperiment(data: {
  name: string;
  description?: string;
  status: string;
}) {
  await pool.query(
    "INSERT INTO experiments (name, description, status) VALUES ($1, $2, $3)",
    [data.name, data.description, data.status],
  );
}

export async function updateExperiment(
  experimentId: string,
  fields: string[],
  values: any[],
) {
  const index = values.length + 1;
  const sql = `UPDATE experiments SET ${fields.join(", ")} WHERE id = $${index}`;

  await pool.query(sql, [...values, experimentId]);
}

export async function deleteExperiment(experimentId: string) {
  await pool.query("DELETE FROM experiments WHERE id = $1", [experimentId]);
}
