import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // Change in production

// 🧾 SIGNUP
router.post("/signup", async (req, res) => {
  const { name, email, password, confirmPassword, phone, location } = req.body;

  try {
    // 🧩 Check for missing fields
    if (!name || !email || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }

    // 🧩 Confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // 🧩 Simple password validation
    // Must have: at least 8 characters, one letter, one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain at least one letter and one number.",
      });
    }

    // 🧩 Check if user already exists
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🔒 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 💾 Insert new user
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password, phone, location) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, location",
      [name, email, hashedPassword, phone, location]
    );

    // 🎫 Generate token
    const token = jwt.sign({ id: newUser.rows[0].id, email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: newUser.rows[0],
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔑 SIGNIN
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 🧩 Check user existence
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = userResult.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🎫 Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    delete user.password; // Remove password from response

    res.json({ message: "Login successful", user, token });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
