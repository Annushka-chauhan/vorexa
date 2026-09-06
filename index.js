import express from "express";
import cors from "cors"; // 👈 Changed from require to import
import pino from "pino";
import { config } from "dotenv";
import makeConnection from "./db/connection.js";
import authRoutes from "./routes/auth.js";
import jobRoutes from "./routes/jobRoutes.js";

config();

const app = express();
const logger = pino();

// Enable CORS for frontend requests
app.use(cors());
app.use(express.json());

// Database connection
makeConnection(process.env.CONNECTION, logger);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`); // 👈 Fixed backticks for template string
});