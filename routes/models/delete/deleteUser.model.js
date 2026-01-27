import pool from "../../../db/db.js";

export async function deleteUser(username) {
  try {
    const [result] = await pool.query(`DELETE FROM users WHERE username = ?`, [
      username,
    ]);

    if (result.affectedRows === 0) {
      return { success: false, message: `User '${username}' not found.` };
    }

    return {
      success: true,
      message: `User '${username}' deleted successfully.`,
    };
  } catch (error) {
    console.error("Error deleting user:", error.message);
    return { success: false, error: error.message };
  }
}
