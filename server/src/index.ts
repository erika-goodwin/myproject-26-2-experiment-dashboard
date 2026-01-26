import "dotenv/config";
import express from "express";
import type { Application, Request, Response } from "express";
import { connectDB } from "./db/index.js";
import experiments_route from "./routes/experiments_route.js";
import auth_route from "./routes/auth_route.js";
import results_route from "./routes/result_route.js";
import variants_route from "./routes/variants_route.js";
import events_route from "./routes/events_route.js";

const app: Application = express();
const PORT = Number(process.env.PORT) || 3333;

// Global Middleware
app.use(express.json());

app.use((req, _res, next) => {
  console.log("➡️ incoming:", req.method, req.path);
  next();
});

// Routes
app.use("/experiments", experiments_route);
app.use("/auth", auth_route);
app.use("/variants", variants_route);
app.use("/result", results_route);
app.use("/events", events_route);

// Database
await connectDB();

// Examples
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript + Express!");
});

// Server Start!!
app.listen(PORT, () => {
  console.log("🔥 EXPRESS PID", process.pid); // You can do 'kill XXXX'
  console.log(`🚀 Listening on ${PORT}`);
  console.log(`Server running at http://localhost:${PORT}`);
});
