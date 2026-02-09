import pool from "../../db/db.js";
import handleTokens from "../adminFunctions/handleTokens.js";

export async function checkToken(username) {
  const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [
    username,
  ]);

  if (rows.length === 0) {
    return { success: false, message: "User not found" };
  }

  const user = rows[0];

  return { success: true, user };
}
