import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExt = /jpeg|jpg|png|pdf/;
  const extName = allowedExt.test(path.extname(file.originalname).toLowerCase());

  const mimeType =
    file.mimetype === "application/pdf" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png";

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Sirf PDF, JPG, JPEG, PNG file allowed hai"));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 40 * 1024,
  },
  fileFilter,
});

export default upload;
