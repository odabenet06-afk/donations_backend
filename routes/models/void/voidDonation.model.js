import pool from "../../../db/db.js";

export async function voidDonation(id) {
  try {
    const [donationRows] = await pool.query(
      `SELECT amount FROM donations WHERE id = ?`,
      [id],
    );

    if (donationRows.length === 0) {
      return { success: false, message: "Donation not found." };
    }

    const [result] = await pool.query(
      `UPDATE donations 
       SET status = 'void'
       WHERE id = ? `,
      [id],
    );

    const amount = donationRows[0].amount;

    await pool.query(
      `UPDATE system_stats SET total_amount_received = total_amount_received - ? WHERE id = 1`,
      [amount],
    );

    return {
      success: true,
      message: `Donation updated successfully.`,
    };
  } catch (error) {
    console.error("Error editing donation:", error.message);
    return { success: false, error: error.message };
  }
}
