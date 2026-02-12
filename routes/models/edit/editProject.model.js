import pool from "../../../db/db.js";
import handleEncryption from "../../adminFunctions/bcrypt.js";

export async function editProject(
  id,
  name,
  description,
  status,
  start_date,
  end_date,
) {
  try {
    const [result] = await pool.query(
      `UPDATE projects
       SET name = ?, description = ?, status = ?, start_date = ?, end_date = ? 
       WHERE id = ?`,
      [name, description, status, start_date, end_date, id],
    );

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: `Project not found.`,
      };
    }

    return {
      success: true,
      message: `Project updated successfully.`,
    };
  } catch (error) {
    console.error("Error editing Project:", error.message);
    return { success: false, error: error.message };
  }
}
