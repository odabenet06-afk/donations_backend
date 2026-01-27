import pool from "../../../db/db.js";

export async function loadProjects() {
  const query = `SELECT * FROM projects`;
  const [rows] = await pool.query(query);
  return rows;
}
