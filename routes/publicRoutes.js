import express from "express";
import pool from "../db/db.js";
import { loadData } from "./controllers/load/load.controller.js";

const router = express.Router();

router.get("/load", loadData);

export default router;
