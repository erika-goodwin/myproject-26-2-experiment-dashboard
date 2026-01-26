import { pool } from "../db/index.js";

export async function createEvent(
  experiments_id: string,
  anonymous_id: string,
  variant_id: string,
  event_type: string,
) {
  await pool.query(
    "insert into events (experiments_id, anonymous_id, variant_id, event_type) VALUES ($1, $2, $3, $4)",
    [experiments_id, anonymous_id, variant_id, event_type],
  );
}
