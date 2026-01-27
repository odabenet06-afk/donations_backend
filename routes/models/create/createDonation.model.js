import pool from "../../../db/db.js";

export async function createDonation(donationData, username) {
  const {
    amount,
    currency,
    donor_id,
    donation_purpose,
    receipt_number,
    donor_name,
  } = donationData;

  try {
    const [result] = await pool.query(
      `INSERT INTO donations (
        amount, currency, donor_id, donation_purpose, receipt_number, donor_name,
        created_by_username, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        amount,
        currency,
        donor_id,
        donation_purpose,
        receipt_number,
        donor_name,
        username,
      ],
    );
    


    await pool.query(
      `UPDATE system_stats SET total_donations_count = total_donations_count + 1 WHERE id = 1`,
    );

    await pool.query(
      `UPDATE system_stats SET total_amount_received = total_amount_received + ? WHERE id = 1`,
      [amount],
    );

    await pool.query(
      `INSERT INTO audit_logs (entity_type, entity_id, changed_at, action, changed_by_username)
       VALUES (?, ?, NOW(), ?, ?)`,
      ["donation", result.insertId, "create", username],
    );
    const [donorRows] = await pool.query(
      `SELECT email FROM donors WHERE donor_public_id = ?`,
      [donor_id],
    );

    if (donorRows.length === 0) {
      return { success: false, error: "Donor not found" };
    }

    const donorEmail = donorRows[0].email;

    console.log("Donation created with ID:", result.insertId);
    return { success: true, id: result.insertId, email: donorEmail };
  } catch (error) {
    console.error("Error creating donation:", error.message);
    return { success: false, error: error.message };
  }
}
