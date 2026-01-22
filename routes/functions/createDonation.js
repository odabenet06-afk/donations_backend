import pool from "../../db/db.js";

const createDonation = async (donationData, username) => {
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
        amount, 
        currency, 
        donor_id, 
        donation_purpose, 
        receipt_number, 
        donor_name,
        created_by_username,
        created_at
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
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
      `UPDATE system_stats 
   SET total_donations_count = total_donations_count + 1 
   WHERE id = 1`,
    );

    await pool.query(
      `UPDATE system_stats 
   SET total_amount_received = total_amount_received + ? 
   WHERE id = 1`,
      [amount],
    );

    await pool.query(
      `INSERT INTO audit_logs (entity_type, entity_id, changed_at, action, changed_by_username) VALUES (?, ?, NOW(), ?, ?)`,
      ["donation", result.insertId, "create", username],
    );
    console.log("Donation created with ID:", result.insertId);
    return { success: true, id: result.insertId };
  } catch (error) {
    console.error("Error creating donation:", error.message);
    return { success: false, error: error.message };
  }
};

/*

console.log(
  await createDonation(
    {
      amount: 100,
      currency: "USD",
      donor_id: 1,
      donation_purpose: "General Support",
      receipt_number: "R123456",
      donor_name: "Benet Oda",
    },
    "test_admin",
  ),
);
*/


export default createDonation;
