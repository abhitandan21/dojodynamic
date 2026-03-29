import express from "express";
import { getAllCertificates, approveCertificate } from "../controllers/adminController.js";

const router = express.Router();

router.get("/certificates", getAllCertificates);
router.put("/approve/:id", approveCertificate);

export default router;