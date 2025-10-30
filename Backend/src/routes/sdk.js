import express from "express";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";

const router = express.Router();

// ✅ Generate SDK
router.post("/generate", async (req, res) => {
  try {
    const { apiId, language } = req.body;

    if (!apiId || !language) {
      return res.status(400).json({ error: "apiId and language are required" });
    }

    const uploadsDir = path.join(process.cwd(), "uploads");
    const files = fs.readdirSync(uploadsDir);
    const specFile = files.find((f) => f.startsWith(apiId));

    if (!specFile) {
      return res.status(404).json({ error: "Spec file not found" });
    }

    const specFilePath = path.join(uploadsDir, specFile);
    const outputDir = path.join(process.cwd(), "sdks", `${apiId}-${language}`);

    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    // 2. Spawn OpenAPI Generator
    const args = [
      "generate",
      "-i", specFilePath,
      "-g", language,
      "-o", outputDir
    ];

    const generator = spawn("npx", ["openapi-generator-cli", ...args], { shell: true });

    let stdout = "";
    let stderr = "";

    generator.stdout.on("data", (data) => { stdout += data.toString(); });
    generator.stderr.on("data", (data) => { stderr += data.toString(); });

    generator.on("close", (code) => {
      if (code !== 0) {
        console.error("SDK Generation Error:", stderr);
        return res.status(500).json({ error: "Failed to generate SDK", details: stderr });
      }
      console.log("SDK Generated Successfully:", stdout);
      res.json({ message: "SDK generated successfully!", sdkPath: outputDir });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

// ✅ Download SDK
router.get("/download/:apiId/:language", async (req, res) => {
  try {
    const { apiId, language } = req.params;
    const sdkDir = path.join(process.cwd(), "sdks", `${apiId}-${language}`);

    if (!fs.existsSync(sdkDir)) {
      return res.status(404).json({ error: "SDK not found. Please generate it first." });
    }

    const archiver = (await import("archiver")).default;
    const archive = archiver("zip", { zlib: { level: 9 } });

    res.attachment(`${apiId}-${language}-sdk.zip`); // set headers for download
    archive.pipe(res);
    archive.directory(sdkDir, false);
    await archive.finalize();

  } catch (error) {
    console.error("Error during SDK download:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
