import pool from "../../../db/db.js";

export async function getCategory() {
  const [categories] = await pool.query(`SELECT * FROM category`);
  return categories;
}
