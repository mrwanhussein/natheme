import { Request, Response, NextFunction } from "express";

export const isOwner = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user; // added by authenticateUser middleware

  if (!user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  // ✅ Check if user email matches the OWNER_EMAIL in .env
  if (user.email !== process.env.OWNER_EMAIL) {
    return res.status(403).json({ message: "Access denied: Owner only" });
  }

  next();
};
