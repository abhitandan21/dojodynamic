import multer from "multer";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

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

console.log(
  "Permanent Upload Directory:",
  uploadDir
);

// ==========================================
// STORAGE
// ==========================================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const safeName = file.originalname.replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    );

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
  // ONLY PDF, JPG, JPEG
  const allowedExt =
    /\.(pdf|jpg|jpeg)$/i;

  const extName =
    allowedExt.test(
      path.extname(file.originalname)
    );

  const allowedMimeTypes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
  ];

  const mimeType =
    allowedMimeTypes.includes(
      file.mimetype
    );

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Sirf PDF, JPG aur JPEG file allowed hai. PNG allowed nahi hai."
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
    // MAXIMUM 3 MB
    fileSize: 3 * 1024 * 1024,
  },

  fileFilter,
});

export default upload;