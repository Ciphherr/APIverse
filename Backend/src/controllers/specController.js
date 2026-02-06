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

    const providerId = req.body.providerId || "demo-provider";
    const apiName = parsedSpec.info.title;
    const apiVersion = parsedSpec.info.version;

    // Check if API with same name and version already exists
    let existingApi = await Api.findOne({
      name: apiName,
      version: apiVersion,
      providerId: providerId,
    });

    let apiId;
    let api;

    if (existingApi) {
      // Update existing API
      existingApi.spec = parsedSpec;
      existingApi.description = parsedSpec.info.description || "No description provided";
      existingApi.updatedAt = new Date();
      api = await existingApi.save();
      apiId = existingApi._id.toString();
      
      // Clean up uploaded file
      fs.unlinkSync(filePath);
    } else {
      // Create new API
      const newApi = new Api({
        providerId: providerId,
        name: apiName,
        version: apiVersion,
        description: parsedSpec.info.description || "No description provided",
        spec: parsedSpec,
      });

      api = await newApi.save();
      apiId = newApi._id.toString();

      // Rename uploaded file to apiId
      const ext = path.extname(req.file.originalname);
      const newFileName = `${apiId}${ext}`;
      const newFilePath = path.join("uploads", newFileName);

      fs.renameSync(filePath, newFilePath);
    }

    res.status(201).json({
      message: existingApi ? "API Spec updated successfully" : "API Spec uploaded successfully",
      apiId,
      api: {
        _id: api._id.toString(),
        name: api.name,
        version: api.version,
        description: api.description,
        isSaved: api.isSaved,
      },
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

    // Return spec plus metadata for frontend display
    res.status(200).json({
      _id: api._id.toString(),
      name: api.name,
      version: api.version,
      providerId: api.providerId,
      providerName: api.providerName || null,
      providerWebsite: api.providerWebsite || null,
      description: api.description,
      isSaved: api.isSaved,
      savedAt: api.savedAt,
      updatedAt: api.updatedAt,
      spec: api.spec,
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

/**
 * Save an API (mark as saved)
 */
export const saveApi = async (req, res) => {
  try {
    const { id } = req.params;
    // Accept optional metadata fields in body
    const { providerName, providerWebsite, description: descOverride } = req.body || {};

    const update = { isSaved: true, savedAt: new Date(), updatedAt: new Date() };
    if (providerName) update.providerName = providerName;
    if (providerWebsite) update.providerWebsite = providerWebsite;
    if (descOverride) update.description = descOverride;

    const api = await Api.findByIdAndUpdate(
      id,
      update,
      { new: true }
    );

    if (!api) {
      return res.status(404).json({ message: "API not found" });
    }

    res.status(200).json({
      message: "API saved successfully",
      api: {
        _id: api._id.toString(),
        name: api.name,
        version: api.version,
        description: api.description,
        providerName: api.providerName,
        providerWebsite: api.providerWebsite,
        isSaved: api.isSaved,
        savedAt: api.savedAt,
        updatedAt: api.updatedAt,
      }
    });
  } catch (error) {
    console.error("Error saving API:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all saved APIs
 */
export const getAllSavedApis = async (req, res) => {
  try {
    const apis = await Api.find({ isSaved: true }).select('_id name version description isSaved savedAt updatedAt createdAt providerId');
    
    res.status(200).json({
      message: "Saved APIs retrieved successfully",
      count: apis.length,
      apis: apis.map(api => ({
        _id: api._id.toString(),
        name: api.name,
        version: api.version,
        description: api.description,
        isSaved: api.isSaved,
        savedAt: api.savedAt,
        updatedAt: api.updatedAt,
        createdAt: api.createdAt,
        providerId: api.providerId,
      }))
    });
  } catch (error) {
    console.error("Error fetching saved APIs:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all APIs (both saved and unsaved)
 */
export const getAllApis = async (req, res) => {
  try {
    const apis = await Api.find({}).select('_id name version description isSaved savedAt updatedAt createdAt providerId');
    
    res.status(200).json({
      message: "All APIs retrieved successfully",
      count: apis.length,
      apis: apis.map(api => ({
        _id: api._id.toString(),
        name: api.name,
        version: api.version,
        description: api.description,
        isSaved: api.isSaved,
        savedAt: api.savedAt,
        updatedAt: api.updatedAt,
        createdAt: api.createdAt,
        providerId: api.providerId,
      }))
    });
  } catch (error) {
    console.error("Error fetching all APIs:", error);
    res.status(500).json({ message: error.message });
  }
};