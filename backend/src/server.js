import express from "express";
const app = express();
import path from "path";
import { mongoConnection } from "./utils/db.js";
import { checkAuth } from "./middleware/checkAuth.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import dotenv from "dotenv";
dotenv.config();

const __dirname = path.resolve();

const PORT = process.env.PORT || 5000;

app.use(express.json()); // Parse JSON bodies

app.use(cookieParser());

//helmet for security headers
app.use(helmet());

// CORS configuration - MUST be before routes
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Simple test route
app.get("/", (req, res) => {
  res.json({ message: "API is running!" });
});

// Connect to MongoDB
mongoConnection();

//controller declarations
import userController from "./Controllers/userController.js";
import { arcjetMiddleware } from "./middleware/arcjet.middleware.js";

//user routes
app.post("/api/user/login", arcjetMiddleware, userController.login);
app.post("/api/user/register", arcjetMiddleware, userController.register);
app.post("/api/user/logout", arcjetMiddleware, userController.logout);

// make ready for deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
