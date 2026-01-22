import express from "express";
import pool from "../db/db.js";
import createDonor from "../routes/functions/createDonor.js";
import handleTokens from "./functions/handleTokens.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import editDonor from "./functions/editDonor.js";
import auth from "./functions/auth.js";
import createDonation from "./functions/createDonation.js";
import createExpense from "./functions/createExpense.js";
import createUser from "./functions/createUser.js";
import deleteUser from "./functions/deleteUser.js";
import editUser from "./functions/editUser.js";
import { toggleReload } from "../index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, "../.env") });

const router = express.Router();

//WORKS

router.post("/load", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Missing authorisation header" });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = handleTokens.checkToken(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    let data = {};
    const limit = 10;
    const { type } = req.body;
    let offset = 0;

    if (type.donors !== undefined && type.donors !== null) {
      offset = Number(type.donors * limit);
      const [donors] = await pool.query(
        `SELECT * FROM donors WHERE status = 'active' ORDER BY id DESC LIMIT ? OFFSET ?`,
        [limit, offset],
      );

      data.donors = donors;
    }

    if (type.donations !== undefined && type.donations !== null) {
      offset = Number(type.donations * limit);
      const [donations] = await pool.query(
        `SELECT d.*, dr.first_name, dr.last_name FROM donations d JOIN donors dr ON d.donor_id = dr.id WHERE d.status = 'active' ORDER BY d.id DESC LIMIT ? OFFSET ?`,
        [limit, offset],
      );

      data.donations = donations;
    }
    if (type.expenses !== undefined && type.expenses !== null) {
      offset = Number(type.expenses * limit);
      const [expenses] = await pool.query(
        `SELECT e.*, p.name as project_name
     FROM expenses e
     LEFT JOIN projects p ON e.project_name = p.id
     WHERE e.status = 'active'
     ORDER BY e.id DESC
     LIMIT ? OFFSET ?`,
        [limit, offset],
      );

      data.expenses = expenses;
    }
    if (type.projects !== undefined && type.projects !== null) {
      offset = Number(type.projects * limit);
      const [projects] = await pool.query(
        `SELECT * FROM projects ORDER BY id DESC LIMIT ? OFFSET ?`,
        [limit, offset],
      );
      data.projects = projects;
    }
    if (type.stats !== undefined && type.stats !== null) {
      const [stats] = await pool.query(
        `SELECT * FROM system_stats WHERE id = 1`,
      );
      data.stats = stats;
    }
    if (type.logs !== undefined && type.logs !== null) {
      offset = Number(type.logs * 20);

      if (decoded.role !== "admin") {
        return res.status(403).json({ message: "Permission denied" });
      }

      const [logs] = await pool.query(
        "SELECT * FROM audit_logs ORDER BY id DESC LIMIT ? OFFSET ?",
        [20, offset],
      );
      data.logs = logs;
    }
    return res.status(200).json({ data });
  } catch (error) {
    console.error("Load Data Error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//WORKS

router.post("/auth", async (req, res) => {
  const { username, password } = req.body;

  const result = await auth(username, password);

  if (!result.success) {
    return res.status(401).json({ message: result.message });
  }

  const token = handleTokens.generateToken(
    result.user.role,
    process.env.JWT_SECRET,
    result.user.username,
  );

  return res
    .status(200)
    .json({ token, username: result.user.username, role: result.user.role });
});

//WORKS
router.post("/create-donor", async (req, res) => {
  const { donorData } = req.body;

  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Missing authorisation header" });
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = handleTokens.checkToken(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const result = await createDonor(donorData, decoded.username);
  if (result.success) {
    return res.status(201).json({ message: "Donor created" });
  }
  return res.status(500).json({ error: result.error });
});

//WORKS

router.post("/edit-donor", async (req, res) => {
  const { donorData } = req.body;

  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Missing authorisation header" });
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = handleTokens.checkToken(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (decoded.role !== "admin") {
    return res.status(403).json({ message: "Permission denied" });
  }

  const result = await editDonor(donorData, decoded.username);
  if (result.success) {
    return res.status(201).json({ message: "Donor changed" });
  }
  return res.status(500).json({ error: result.error });
});

//WORKS

router.post("/create-donation", async (req, res) => {
  const { donationData } = req.body;

  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Missing authorisation header" });
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = handleTokens.checkToken(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const result = await createDonation(donationData, decoded.username);
  if (result.success) {
    toggleReload();
    return res.status(201).json({ message: "Donation created" });
  }
  return res.status(500).json({ error: result.error });
});

//WORKS
router.post("/create-expense", async (req, res) => {
  const { expenseData } = req.body;

  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Missing authorisation header" });
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = handleTokens.checkToken(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const result = await createExpense(expenseData, decoded.username);
  if (result.success) {
    return res.status(201).json({ message: "Expense created" });
  }
  return res.status(500).json({ error: result.error });
});

//WORKS
router.post("/create-user", async (req, res) => {
  const { userData } = req.body;

  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Missing authorisation header" });
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = handleTokens.checkToken(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (decoded.role !== "admin") {
    return res.status(403).json({ message: "Permission denied" });
  }

  const result = await createUser(userData);
  if (result.success) {
    return res.status(201).json({ message: "User created" });
  }
  return res.status(500).json({ error: result.error });
});

//CHECKED WORKS PROPERLY

router.post("/edit-user", async (req, res) => {
  const { userData } = req.body;

  console.log(userData);

  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Missing authorisation header" });
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = handleTokens.checkToken(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (decoded.role !== "admin") {
    return res.status(403).json({ message: "Permission denied" });
  }

  const result = await editUser(userData);
  if (result.success) {
    return res.status(201).json({ message: "User edited successfully" });
  }
  return res.status(500).json({ error: result.error });
});

//OK

router.post("/delete-user", async (req, res) => {
  const { username } = req.body;

  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Missing authorisation header" });
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = handleTokens.checkToken(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (decoded.role !== "admin") {
    return res.status(403).json({ message: "Permission denied" });
  }

  const result = await deleteUser(username);
  if (result.success) {
    return res.status(201).json({ message: "User deleted successfully" });
  }
  return res.status(500).json({ error: result.error });
});

export default router;
