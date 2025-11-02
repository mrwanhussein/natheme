import { Request, Response } from "express";
import pool from "../config/db";
import fs from "fs";
import path from "path";

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
// 🧾 DELETE Catalog (Admin Only)
export const deleteCatalog = async (
  req: Request,
  res: Response
): Promise<void> => {
  const catalogId = req.params.id;

  try {
    // Check if catalog exists
    const result = await pool.query("SELECT * FROM catalogs WHERE id = $1", [
      catalogId,
    ]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: "Catalog not found" });
      return;
    }

    const catalog = result.rows[0];
    const filePath = path.join(__dirname, "../../", catalog.file_path);

    // Delete file from server if exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete catalog record from database
    await pool.query("DELETE FROM catalogs WHERE id = $1", [catalogId]);

    res.status(200).json({ message: "Catalog deleted successfully" });
  } catch (error) {
    console.error("Delete catalog error:", error);
    res.status(500).json({ message: "Server error while deleting catalog" });
  }
};
