import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import { uploadSpec, getApiById, downloadSdk, saveApi, getAllSavedApis, getAllApis } from "../controllers/specController.js";

const router = express.Router();

// Routes
router.post("/upload", upload.single("specfile"), uploadSpec);
router.get("/:id", getApiById);
router.get("/download-sdk/:apiId", downloadSdk);
router.post("/:id/save", saveApi);
router.get("/api/saved", getAllSavedApis);
router.get("/api/all", getAllApis);

export default router;
