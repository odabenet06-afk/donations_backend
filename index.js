import express from "express";
import dotenv from "dotenv";
import pool from "./db/db.js";
import loadRoutes from "./routes/publicRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import http from "http";
import { WebSocketServer } from "ws";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "https://open-hands-seven.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(helmet());
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, try again later",
});

wss.on("connection", (ws) => {
  console.log("Client connected");
});

export function toggleReload() {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ message: "Reload" }));
    }
  });
}

app.use("/api", loadRoutes);
app.use("/admin", adminRoutes);
app.use(limiter);

const startServer = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Database connected and pool initialized.");
    connection.release();

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
};

startServer();
