import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import { uploadSpec, getApiById, downloadSdk } from "../controllers/specController.js";

const router = express.Router();

// Routes
router.post("/upload", upload.single("specfile"), uploadSpec);
router.get("/:id", getApiById);
router.get("/download-sdk/:apiId", downloadSdk);

export default router;
