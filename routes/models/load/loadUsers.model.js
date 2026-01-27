import pool from "../../../db/db.js";

export async function loadUsers() {
  const query = `SELECT * FROM users`;
  const [rows] = await pool.query(query);
  return rows;
}

