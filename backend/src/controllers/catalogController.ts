import { Request, Response } from "express";
import pool from "../config/db";

export const uploadCatalog = async (req: Request, res: Response) => {
  const { title, description } = req.body;
  const filePath = req.file?.path;

  try {
    if (!filePath) return res.status(400).json({ message: "File required" });

    const result = await pool.query(
      "INSERT INTO catalogs (title, description, file_path) VALUES ($1, $2, $3) RETURNING *",
      [title, description, filePath]
    );

    res.status(201).json({
      message: "Catalog uploaded successfully",
      catalog: result.rows[0],
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCatalogs = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM catalogs ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching catalogs:", error);
    res.status(500).json({ message: "Server error fetching catalogs" });
  }
};
