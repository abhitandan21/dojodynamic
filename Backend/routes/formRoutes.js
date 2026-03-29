import express from "express";
import { saveForm } from "../controllers/formController.js";

const router = express.Router();

router.post("/", saveForm);

export default router;