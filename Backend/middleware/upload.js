import multer from "multer";
import path from "path";
import fs from "fs";

// ==========================================
// PERMANENT UPLOAD DIRECTORY
// ==========================================
// IMPORTANT:
// Do NOT use process.cwd() here because Hostinger
// deployment creates a new hbuilds/versions folder.
//
// This folder stays outside deployment versions.
const uploadDir =
  process.env.UPLOAD_DIR ||
  "/home/u370151912/domains/api.amaasa.com/uploads";

// Create folder if it does not exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

console.log("Permanent Upload Directory:", uploadDir);

// ==========================================
// STORAGE
// ==========================================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");

    cb(
      null,
      Date.now() + "-" + safeName
    );
  },
});

// ==========================================
// FILE FILTER
// ==========================================

const fileFilter = (req, file, cb) => {
  const allowedExt = /jpeg|jpg|png|pdf/;

  const extName = allowedExt.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimeType =
    file.mimetype === "application/pdf" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png";

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Sirf PDF, JPG, JPEG, PNG file allowed hai"
      )
    );
  }
};

// ==========================================
// MULTER
// ==========================================

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter,
});

export default upload;