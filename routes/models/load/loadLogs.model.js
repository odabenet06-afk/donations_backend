import pool from "../../../db/db.js";

export async function loadLogs() {
  let query = `SELECT * FROM audit_logs`;
  const params = [];

  const [rows] = await pool.query(query, params);
  return rows;
}
