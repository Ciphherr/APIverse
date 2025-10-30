import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import specsRoute from "./routes/specs.js";
import sdkRoutes from "./routes/sdk.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (req.path.startsWith("/embed")) {
    // Allow embedding by any origin (use tighter policy in production)
    res.setHeader("X-Frame-Options", "ALLOWALL"); // or remove this header
    res.setHeader("Content-Security-Policy", "frame-ancestors *");
  }
  return next();
});

connectDB();

// Routes
app.use("/api/specs", specsRoute);
app.use("/sdks", express.static(path.join(process.cwd(), "sdks")));
app.use("/api/sdk", sdkRoutes);

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
