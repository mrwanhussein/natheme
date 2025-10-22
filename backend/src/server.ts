import express from "express";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
});

(async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Database connected successfully ✅", result.rows[0]);
  } catch (error) {
    console.error("Database connection failed ❌", error);
  }
})();

app.get("/", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.send(`Hello from Natheme! Time: ${result.rows[0].now}`);
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running...");
});
