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
  spec: Object,
  endpoints: [endpointSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Api", apiSchema);
