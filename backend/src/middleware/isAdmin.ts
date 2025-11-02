import { Request, Response, NextFunction } from "express";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user; // added by authenticateUser middleware

  // 🧩 Check if user is authenticated
  if (!user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  // 🧩 Check if user has admin role
  if (user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }

  // ✅ Allow access
  next();
};
