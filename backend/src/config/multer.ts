import multer from "multer";
import path from "path";
import fs from "fs";

// Utility to ensure the upload folder exists
const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// ---------- 1️⃣ Catalogs Upload (Single PDF/DOC) ----------
const storage = multer.diskStorage({
  destination: "uploads/catalogs", // relative to backend root
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const catalogFileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = /pdf|doc|docx/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF or DOC files are allowed"));
  }
};

export const uploadCatalog = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: catalogFileFilter,
});

// ---------- 2️⃣ Projects Upload (Multiple Images) ----------
const projectStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/projects";
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const projectFileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (JPEG, PNG, GIF, WEBP)"));
  }
};

export const uploadProject = multer({
  storage: projectStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per image
  fileFilter: projectFileFilter,
});
