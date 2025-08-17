// External package imports
import express from "express";
import cors from "cors";

// Local module imports
import { dbConnect } from "./modules/dbConnection";
import { appConnect } from "./modules/appConnection";
import { router as userRoutes } from "./modules/userRoutes";

// Global variable declaration
const app = express();

// Server start up
app.use(express.json());
app.use(cors());
app.use("/", userRoutes);
console.log("✅ User routes mounted!");

dbConnect();
appConnect(app);
