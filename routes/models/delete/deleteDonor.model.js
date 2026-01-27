import pool from "../../../db/db.js";

export async function deleteDonor(id) {
  try {
    const [result] = await pool.query(
      `DELETE FROM donors WHERE donor_public_id = ?`,
      [id],
    );

    if (result.affectedRows === 0) {
      return { success: false, message: `Donor '${id}' not found.` };
    }
    await pool.query(
      `UPDATE system_stats SET total_donors = total_donors - 1 WHERE id = 1`,
    );

    return { success: true, message: `Donor '${id}' deleted successfully.` };
  } catch (error) {
    console.error("Error deleting donor:", error.message);
    return { success: false, error: error.message };
  }
}
