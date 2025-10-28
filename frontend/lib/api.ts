import axios from "axios";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL // will come from .env in production
    : "http://localhost:5000"; // local backend

export const api = axios.create({
  baseURL: API_BASE_URL,
});
