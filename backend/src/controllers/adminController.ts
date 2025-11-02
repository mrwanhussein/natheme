import { Request, Response } from "express";
import pool from "../config/db";
import fs from "fs";
import path from "path";

/**
 * Promote an existing user to admin using their email
 * Only accessible by admins
 */
export const promoteToAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  try {
    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    // Check if user exists
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (userResult.rows.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const user = userResult.rows[0];

    // If user is already admin
    if (user.role === "admin") {
      res.status(400).json({ message: "User is already an admin" });
      return;
    }

    // Promote to admin
    await pool.query("UPDATE users SET role = 'admin' WHERE email = $1", [
      email,
    ]);
    res
      .status(200)
      .json({ message: `User ${email} promoted to admin successfully` });
  } catch (error) {
    console.error("Promote to admin error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Demote an admin back to customer role (optional)
 * Only accessible by admins
 */
export const demoteToCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  try {
    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    // Check if user exists
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (userResult.rows.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const user = userResult.rows[0];

    if (user.role !== "admin") {
      res.status(400).json({ message: "User is not an admin" });
      return;
    }

    // Demote to customer
    await pool.query("UPDATE users SET role = 'customer' WHERE email = $1", [
      email,
    ]);
    res
      .status(200)
      .json({ message: `User ${email} demoted to customer successfully` });
  } catch (error) {
    console.error("Demote to customer error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// 🔹 Dashboard Summary (Admins + Owner)
export const getDashboardSummary = async (req: Request, res: Response) => {
  try {
    const projectsCount = await pool.query('SELECT COUNT(*) FROM "Projects"');
    const catalogsCount = await pool.query("SELECT COUNT(*) FROM catalogs");
    const usersCount = await pool.query('SELECT COUNT(*) FROM "Users"');

    res.json({
      message: "Dashboard summary",
      data: {
        totalProjects: parseInt(projectsCount.rows[0].count),
        totalCatalogs: parseInt(catalogsCount.rows[0].count),
        totalUsers: parseInt(usersCount.rows[0].count),
      },
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================================
// 🧱 PROJECT MANAGEMENT (Admin)
// ================================

// ➕ Add new project
export const adminAddProject = async (req: Request, res: Response) => {
  const { name, description, image_urls } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO "Projects" (name, description, image_urls) VALUES ($1, $2, $3) RETURNING *',
      [name, description, image_urls]
    );
    res
      .status(201)
      .json({ message: "Project added successfully", project: result.rows[0] });
  } catch (error) {
    console.error("Add project error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✏️ Update project
export const adminUpdateProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, image_urls } = req.body;
  try {
    const result = await pool.query(
      'UPDATE "Projects" SET name=$1, description=$2, image_urls=$3, updated_at=NOW() WHERE id=$4 RETURNING *',
      [name, description, image_urls, id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ message: "Project not found" });

    res.json({
      message: "Project updated successfully",
      project: result.rows[0],
    });
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🗑️ Delete project
export const adminDeleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM "Projects" WHERE id=$1', [id]);
    if (result.rowCount === 0)
      return res.status(404).json({ message: "Project not found" });

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================================
// 📚 CATALOG MANAGEMENT (Admin)
// ================================

// ➕ Upload catalog
export const adminUploadCatalog = async (req: Request, res: Response) => {
  const { title, description } = req.body;
  const filePath = req.file?.path;
  try {
    if (!filePath) return res.status(400).json({ message: "File required" });

    const result = await pool.query(
      "INSERT INTO catalogs (title, description, file_path) VALUES ($1, $2, $3) RETURNING *",
      [title, description, filePath]
    );
    res
      .status(201)
      .json({
        message: "Catalog uploaded successfully",
        catalog: result.rows[0],
      });
  } catch (error) {
    console.error("Upload catalog error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ❌ Delete catalog
export const adminDeleteCatalog = async (req: Request, res: Response) => {
  const catalogId = req.params.id;

  try {
    const result = await pool.query("SELECT * FROM catalogs WHERE id=$1", [
      catalogId,
    ]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Catalog not found" });

    const catalog = result.rows[0];
    const filePath = path.join(__dirname, "../../", catalog.file_path);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await pool.query("DELETE FROM catalogs WHERE id=$1", [catalogId]);
    res.json({ message: "Catalog deleted successfully" });
  } catch (error) {
    console.error("Delete catalog error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
