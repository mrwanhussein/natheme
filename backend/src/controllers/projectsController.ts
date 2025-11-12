import { Request, Response } from "express";
import pool from "..//config/db";
import { Project } from "../types/project";

// GET /api/projects
export const getProjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await pool.query('SELECT * FROM "Projects" ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/projects

export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const files = req.files as Express.Multer.File[];

    // ✅ Convert relative file paths to full URLs (so frontend can display them)
    const imageUrls =
      files?.map(
        (file) =>
          `${req.protocol}://${req.get("host")}/${file.path.replace(
            /\\/g,
            "/"
          )}`
      ) || [];

    const result = await pool.query(
      'INSERT INTO "Projects" (name, description, image_urls) VALUES ($1, $2, $3) RETURNING *',
      [name, description, imageUrls]
    );

    res.status(201).json({
      message: "Project created successfully",
      project: result.rows[0],
    });
  } catch (error) {
    console.error("createProject error:", error);
    res.status(500).json({ message: "Failed to create project" });
  }
};

// PUT /api/projects/:id
export const updateProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { name, description, image_urls }: Project = req.body;

  try {
    const result = await pool.query(
      'UPDATE "Projects" SET name=$1, description=$2, image_urls=$3, updated_at=NOW() WHERE id=$4 RETURNING *',
      [name, description, image_urls, id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE /api/projects/:id
export const deleteProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM "Projects" WHERE id=$1', [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
