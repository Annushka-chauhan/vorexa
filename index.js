import express from "express"
import pino from "pino"
import {config} from "dotenv"
import makeConnection from "./db/connection.js"
import authRoutes from "./routes/auth.js";
import jobRoutes from "./routes/jobRoutes.js";
config()
const app = express()
const logger = pino()
app.use(express.json());
//app.get("/",)
//config .env ko process.env mai deta hai jisse hame connection string milegi or pino se logger wala part 
makeConnection(process.env.CONNECTION, logger);
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.listen(5500,()=>{
  console.log("Server startes on port ${PORT}");
})