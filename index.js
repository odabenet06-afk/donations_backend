import express from "express";
import dotenv from "dotenv";
import pool from "./db/db.js";
import loadRoutes from "./routes/load.js";
import adminRoutes from "./routes/admin.js";
import http from "http";
import { WebSocketServer } from "ws";

dotenv.config();

const app = express();
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");
});

export function toggleReload() {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      // 1 is OPEN
      client.send(JSON.stringify({ message: "Reload" }));
    }
  });
}

app.use("/api", loadRoutes);
app.use("/admin", adminRoutes);

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
