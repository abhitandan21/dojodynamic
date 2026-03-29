import express from "express";
import { addCertificate, getMyCertificates } from "../controllers/certificateController.js";

const router = express.Router();

router.post("/", addCertificate);
router.get("/:id", getMyCertificates);

export default router;