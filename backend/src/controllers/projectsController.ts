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
export const createProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description, image_urls }: Project = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO "Projects" (name, description, image_urls) VALUES ($1, $2, $3) RETURNING *',
      [name, description, image_urls]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
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
