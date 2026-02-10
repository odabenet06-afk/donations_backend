import pool from "../../../db/db.js";
import handleEncryption from "../../adminFunctions/bcrypt.js";

export async function editUser(userData) {
  try {
    let query;
    let params;

    if (userData.password && userData.password.trim() !== "") {
      const hashedPassword = await handleEncryption.hashPassword(
        userData.password,
      );

      query = `UPDATE users 
               SET username = ?, password_hash = ?, role = ? 
               WHERE username = ?`;
      params = [
        userData.username,
        hashedPassword,
        userData.role,
        userData.before,
      ];
    } else {
      query = `UPDATE users 
               SET username = ?, role = ? 
               WHERE username = ?`;
      params = [userData.username, userData.role, userData.before];
    }

    const [result] = await pool.query(query, params);

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: `User '${userData.before}' not found.`,
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error editing user:", error.message);
    return { success: false, error: error.message };
  }
}
