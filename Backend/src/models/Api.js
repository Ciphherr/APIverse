import mongoose from "mongoose";

const endpointSchema = new mongoose.Schema({
  path: String,
  method: String,
  summary: String,
  parameters: Object,
  responses: Object,
}, { _id: false });

const apiSchema = new mongoose.Schema({
  name: { type: String, required: true },
  version: String,
  providerId: { type: String, required: true },
  providerName: { type: String },
  providerWebsite: { type: String },
  description: { type: String },
  spec: Object,
  endpoints: [endpointSchema],
  isSaved: { type: Boolean, default: false },
  savedAt: { type: Date, default: null },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Api", apiSchema);
