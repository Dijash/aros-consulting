import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";
import connectDB from "./config/DBConfig.js";
import router from "./routes/MainRoute.js";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const corsOrigins = new Set(
  (process.env.CORS_ORIGIN || 'http://localhost:5173,https://aros-consulting-3n6c.vercel.app')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
);

app.use(cors({
  origin(origin, callback) {
    if (!origin || corsOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(null, false);
  },
  credentials: true,
}));

app.use(express.json());
app.use(router);

app.get("/health", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

const frontendDist = join(__dirname, '../../frontend/dist');
if (existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.use((req, res, next) => {
    if (req.method === 'GET') {
      res.sendFile(join(frontendDist, 'index.html'));
    } else {
      next();
    }
  });
}

connectDB();

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
