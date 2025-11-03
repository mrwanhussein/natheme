import express from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import projectsRoutes from "./routes/projectsRoutes";
import contactRoutes from "./routes/contactRoutes";
import catalogRoutes from "./routes/catalogRoutes";
import adminRoutes from "./routes/adminRoutes";
import userRoutes from "./routes/userRoutes";
import cors from "cors";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // your React/Next.js frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
// 🧠 Choose which DB to connect to automatically
const connectionString =
  process.env.NODE_ENV === "production"
    ? process.env.SUPABASE_DB_URL
    : process.env.DATABASE_URL;

// 🗄️ Create connection pool
const pool = new Pool({ connectionString });

// 🔍 Test both connections if available
(async () => {
  try {
    console.log("Attempting to connect to database...");

    const result = await pool.query("SELECT current_database(), NOW()");
    console.log(
      `✅ Connected to database: ${result.rows[0].current_database} | Time: ${result.rows[0].now}`
    );
  } catch (error) {
    console.error("❌ Primary database connection failed:", error);

    // 🔄 Try fallback connection (if the first fails)
    if (
      connectionString === process.env.SUPABASE_DB_URL &&
      process.env.DATABASE_URL
    ) {
      console.log("⚙️ Trying fallback: local database...");
      try {
        const localPool = new Pool({
          connectionString: process.env.DATABASE_URL,
        });
        const localResult = await localPool.query(
          "SELECT current_database(), NOW()"
        );
        console.log(
          `✅ Fallback connected to local DB: ${localResult.rows[0].current_database}`
        );
      } catch (localError) {
        console.error("❌ Fallback (local DB) connection failed:", localError);
      }
    }
  }
})();

// 🧭 Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/catalogs", catalogRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/users", userRoutes);
// 🧪 Simple test route
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT current_database(), NOW()");
    res.send(
      `Hello from Natheme 🌿!<br/>Connected to: ${result.rows[0].current_database}<br/>Time: ${result.rows[0].now}`
    );
  } catch (error) {
    res.status(500).send("Database connection error ❌");
  }
});

// 🚀 Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
console.log("JWT Secret in use:", process.env.JWT_SECRET);
