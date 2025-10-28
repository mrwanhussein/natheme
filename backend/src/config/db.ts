import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString:
    process.env.NODE_ENV === "production"
      ? process.env.SUPABASE_DB_URL
      : process.env.DATABASE_URL,
});

(async () => {
  const result = await pool.query("SELECT current_database()");
  console.log("🧭 Connected to database:", result.rows[0].current_database);
})();

export default pool;
