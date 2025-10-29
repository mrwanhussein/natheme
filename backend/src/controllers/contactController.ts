import { Request, Response } from "express";
import pool from "../config/db";
import nodemailer from "nodemailer";
import { ContactMessage } from "../types/contact";

// your receiver email (can be company or personal)
const RECEIVER_EMAIL =
  process.env.CONTACT_RECEIVER_EMAIL || "yourcompany@example.com";

// setup email transporter (use Ethereal for free or Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail", // change if you want another free SMTP provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendContactMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, message }: ContactMessage = req.body;

  if (!name || !email || !message) {
    res
      .status(400)
      .json({ error: "All fields (name, email, message) are required." });
    return;
  }

  try {
    // 1️⃣ Save message in database
    await pool.query(
      'INSERT INTO "ContactMessages" (name, email, message) VALUES ($1, $2, $3)',
      [name, email, message]
    );

    // 2️⃣ Send email notification
    await transporter.sendMail({
      from: `"Natheme Contact" <${process.env.EMAIL_USER}>`,
      to: RECEIVER_EMAIL,
      subject: `New Contact Message from ${name}`,
      text: `
      You received a new message from the Natheme contact form.

      Name: ${name}
      Email: ${email}
      Message:
      ${message}
      `,
    });

    res
      .status(201)
      .json({ success: true, message: "Message received and email sent." });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error while sending message." });
  }
};
