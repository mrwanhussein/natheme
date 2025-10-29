import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db";
import { User } from "../types/user";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // ⚠️ Change in production

// 🧾 SIGNUP
export const signup = async (req: Request, res: Response): Promise<void> => {
  const {
    name,
    email,
    password,
    confirmPassword,
    phone,
    location,
  }: User & { confirmPassword: string } = req.body;

  try {
    // 🧩 Validation
    if (!name || !email || !password || !confirmPassword) {
      res.status(400).json({ message: "Please fill in all required fields" });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ message: "Passwords do not match" });
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain at least one letter and one number.",
      });
      return;
    }

    // 🧩 Check if user exists
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (userExists.rows.length > 0) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // 🔒 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 💾 Insert new user
    const newUserResult = await pool.query(
      "INSERT INTO users (name, email, password, phone, location) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, location",
      [name, email, hashedPassword, phone, location]
    );
    const newUser = newUserResult.rows[0];

    // 🎫 Generate JWT
    const token = jwt.sign({ id: newUser.id, email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔑 SIGNIN
export const signin = async (req: Request, res: Response): Promise<void> => {
  const { email, password }: { email: string; password: string } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });
    delete user.password;

    res.json({ message: "Login successful", user, token });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
