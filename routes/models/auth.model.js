import pool from "../../db/db.js";
import handleEncryption from "../adminFunctions/bcrypt.js";

export async function authUser(username, password) {
  const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [
    username,
  ]);

  if (rows.length === 0) {
    return { success: false, message: "User not found" };
  }

  const user = rows[0];

  const isAuthorised = await handleEncryption.comparePassword(
    password,
    user.password_hash
  );

  if (!isAuthorised) {
    return { success: false, message: "Invalid password" };
  }

  return { success: true, user };
}
