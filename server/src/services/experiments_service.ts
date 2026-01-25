// // import { pool } from "../db";

// import { pool } from "../db/index.js";

// export async function createExperiment(data: {
//   name: string;
//   description?: string;
//   status: string;
// }) {
//   const result = await pool.query(
//     "INSERT INTO experiments (name, description, status) VALUES ($1, $2, $3) RETURNING *",
//     [data.name, data.description, data.status]
//   );+

//   return result.rows[0];
// }
