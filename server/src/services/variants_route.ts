import { pool } from "../db/index.js";

export async function getAllVariants() {
  const result = await pool.query("SELECT * FROM variants");
  return result.rows;
}

export async function getVariantsByExperimentId(experimentId: string) {
  const result = await pool.query(
    "SELECT * FROM variants WHERE experiments_id = $1 ORDER BY name",
    [experimentId],
  );

  return result.rows ?? null;
}

export async function createVariants(experiments_id: string, names: string[]) {
  //   await pool.query(
  //     "INSERT INTO experiments (name, description, status) VALUES ($1, $2, $3)",
  //     [data.name, data.description, data.status],
  //   );

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

// export async function updateExperiment(
//   experimentId: string,
//   fields: string[],
//   values: any[],
// ) {
//   const index = values.length + 1;
//   const sql = `UPDATE experiments SET ${fields.join(", ")} WHERE id = $${index}`;

//   await pool.query(sql, [...values, experimentId]);
// }

export async function deleteByExperimentId(
  experimentData: {
    id: string;
    experiments_id: string;
    name: string;
    weight: string;
  }[],
) {
  //   await pool.query("DELETE FROM experiments WHERE id = $1", [experimentId]);
  await Promise.all(
    experimentData.map((data) => {
      console.log(">>>> deleting this:", data, data.id);
      return pool.query("DELETE FROM variants WHERE id = $1", [data.id]);
    }),
  );
}
