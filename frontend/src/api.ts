import axios from "axios";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-backend-service.onrender.com" // 🔹 replace this with your Render backend URL later
    : "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE_URL,
});
