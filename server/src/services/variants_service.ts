import { pool } from "../db/index.js";

export async function getAllVariants() {
  const result = await pool.query("SELECT * FROM variants");
  return result.rows;
}

export async function getVariantsById(variantId: string) {
  const result = await pool.query("SELECT * FROM variants WHERE id = $1", [
    variantId,
  ]);

  return result.rows ?? null;
}
export async function getVariantsByExperimentId(experimentId: string) {
  const result = await pool.query(
    "SELECT * FROM variants WHERE experiments_id = $1 ORDER BY name",
    [experimentId],
  );

  return result.rows ?? null;
}
export async function getVariantsByExperimentIdAndId(
  experimentId: string,
  variantId: string,
) {
  const result = await pool.query(
    "SELECT * FROM variants WHERE experiments_id = $1 AND id = $2 ORDER BY name",
    [experimentId, variantId],
  );

  return result.rows ?? null;
}

export async function createVariants(experiments_id: string, names: string[]) {
  const numberOfNames = names.length;
  const weight = Number((100 / numberOfNames).toFixed(2));

  await Promise.all(
    names.map((name: string) => {
      console.log(">>>>> map", [experiments_id, name, weight]);
      return pool.query(
        "insert into variants (experiments_id, name, weight) VALUES ($1, $2, $3)",
        [experiments_id, name, weight],
      );
    }),
  );
}

export async function deleteByExperimentId(
  experimentData: {
    id: string;
    experiments_id: string;
    name: string;
    weight: string;
  }[],
) {
  await Promise.all(
    experimentData.map((data) => {
      console.log(">>>> deleting this:", data, data.id);
      return pool.query("DELETE FROM variants WHERE id = $1", [data.id]);
    }),
  );
}
