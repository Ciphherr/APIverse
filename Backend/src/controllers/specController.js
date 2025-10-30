import fs from "fs";
import path from "path";
import yaml from "yaml";
import SwaggerParser from "@apidevtools/swagger-parser";
import Api from "../models/Api.js";

/**
 * Upload and parse an OpenAPI spec file
 * Option 1: Use MongoDB ObjectId as apiId
 */
export const uploadSpec = async (req, res, next) => {
  try {
    // Ensure a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = path.resolve(req.file.path);

    // Read file content
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Parse YAML or JSON
    let parsedSpec;
    if (req.file.originalname.endsWith(".yaml") || req.file.originalname.endsWith(".yml")) {
      parsedSpec = yaml.parse(fileContent);
    } else {
      parsedSpec = JSON.parse(fileContent);
    }

    // Validate the OpenAPI spec
    await SwaggerParser.validate(parsedSpec);

    // Save to MongoDB
    const newApi = new Api({
      providerId: req.body.providerId, // required field
      name: parsedSpec.info.title,
      version: parsedSpec.info.version,
      description: parsedSpec.info.description || "No description provided",
      spec: parsedSpec,
    });

    await newApi.save();

    // Use MongoDB _id as apiId
    const apiId = newApi._id.toString();

    // Rename uploaded file to apiId
    const ext = path.extname(req.file.originalname);
    const newFileName = `${apiId}${ext}`;
    const newFilePath = path.join("uploads", newFileName);

    fs.renameSync(filePath, newFilePath);

    res.status(201).json({
      message: "API Spec uploaded successfully",
      apiId,
      api: newApi,
    });


  } catch (error) {
    console.error("Error uploading spec:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Fetch API spec by ID
 */
export const getApiById = async (req, res) => {
  try {
    const api = await Api.findById(req.params.id);

    if (!api) {
      return res.status(404).json({ message: "API not found" });
    }

    // Explicitly send string _id and spec
    res.status(200).json({
      _id: api._id.toString(),
      spec: api.spec
    });
  } catch (error) {
    console.error("Error fetching API:", error);
    res.status(500).json({ message: error.message });
  }
};


export const downloadSdk = async (req, res) => {
  try {
    const { apiId } = req.params;
    const sdkPath = path.resolve(`sdks/${apiId}.zip`);

    if (!fs.existsSync(sdkPath)) {
      return res.status(404).json({ message: "SDK not found for this API" });
    }

    res.download(sdkPath, `${apiId}-sdk.zip`, (err) => {
      if (err) {
        console.error("Error sending SDK:", err);
        res.status(500).json({ message: "Failed to download SDK" });
      }
    });
  } catch (error) {
    console.error("Error downloading SDK:", error);
    res.status(500).json({ message: error.message });
  }
};