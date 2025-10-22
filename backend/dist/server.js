"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const pool = new pg_1.Pool({
    connectionString: process.env.SUPABASE_DB_URL,
});
(async () => {
    try {
        const result = await pool.query("SELECT NOW()");
        console.log("Database connected successfully ✅", result.rows[0]);
    }
    catch (error) {
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
