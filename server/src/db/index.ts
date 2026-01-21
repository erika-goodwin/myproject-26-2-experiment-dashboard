import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function connectDB() {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Supabase PostgreSQL connected");
  } catch (error) {
    console.error("❌ Database connection failed", error);
    process.exit(1);
  }
}
