import pool from "../../../db/db.js";

export async function deleteCategory(id) {
  try {
    const [result] = await pool.query(`DELETE FROM category WHERE id = ?`, [
      id,
    ]);

    if (result.affectedRows === 0) {
      return { success: false, message: `Category '${id}' not found.` };
    }
    return { success: true, message: `Category '${id}' deleted successfully.` };
  } catch (error) {
    console.error("Error deleting category:", error.message);
    return { success: false, error: error.message };
  }
}
