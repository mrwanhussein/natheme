import { Request, Response } from "express";
import pool from "../config/db";
import { User } from "../types/user";

// 🧾 Get all users
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, phone, location, created_at FROM "users" ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error fetching users" });
  }
};

// 🔍 Search users (by name, email, or phone)
export const searchUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { q } = req.query;

  try {
    if (!q || typeof q !== "string") {
      res.status(400).json({ message: "Please provide a search query" });
      return;
    }

    const result = await pool.query(
      `SELECT id, name, email, phone, location, created_at 
       FROM "users" 
       WHERE name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1
       ORDER BY id ASC`,
      [`%${q}%`]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Server error searching users" });
  }
};

// ➕ Create new user (admin only)
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, password, phone, location }: User = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO "users" (name, email, password, phone, location) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, location, created_at',
      [name, email, password, phone, location]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error creating user" });
  }
};

// ✏️ Update user
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { name, email, phone, location }: User = req.body;

  try {
    const result = await pool.query(
      'UPDATE "users" SET name=$1, email=$2, phone=$3, location=$4, updated_at=NOW() WHERE id=$5 RETURNING id, name, email, phone, location, created_at',
      [name, email, phone, location, id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error updating user" });
  }
};

// ❌ Delete user
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM "users" WHERE id=$1', [id]);

    if (result.rowCount === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error deleting user" });
  }
};
