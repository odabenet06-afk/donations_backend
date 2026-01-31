import pool from "../../../db/db.js";

export async function deleteProject(id) {
  try {
    const [result] = await pool.query(`DELETE FROM projects WHERE id = ?`, [
      id,
    ]);

    if (result.affectedRows === 0) {
      return { success: false, message: `Project '${Projectname}' not found.` };
    }

    return {
      success: true,
      message: `Project deleted successfully.`,
    };
  } catch (error) {
    console.error("Error deleting Project:", error.message);
    return { success: false, error: error.message };
  }
}
