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
    const usersCount = await pool.query('SELECT COUNT(*) FROM "users"');

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

// 🔹 Get all users with role "customer" (for admin dashboard)
export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE role = $1 ORDER BY created_at DESC",
      ["customer"]
    );

    res.status(200).json({
      message: "Customer list fetched successfully",
      customers: result.rows,
    });
  } catch (error) {
    console.error("Get all customers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE role = $1 ORDER BY created_at DESC",
      ["admin"]
    );

    res.status(200).json({
      message: "admins list fetched successfully",
      customers: result.rows,
    });
  } catch (error) {
    console.error("Get all admins error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
