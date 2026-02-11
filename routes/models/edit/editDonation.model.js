import pool from "../../../db/db.js";

export async function editDonation(donationData, username) {
  const { id, donor_id, amount, currency, donor_name, donation_purpose, receipt_number } = donationData;

  if (!id) return { success: false, message: "Donation ID missing" };

  const [rows] = await pool.query(`SELECT * FROM donations WHERE id = ?`, [id]);
  const beforeRecord = rows[0];
  if (!beforeRecord) return { success: false, message: "Donation not found" };

  const editableFields = [
    "amount",
    "currency",
    "donor_id",
    "donation_purpose",
    "receipt_number",
    "donor_name",
  ];

  const updates = [];
  const updateParams = [];
  const before_value = {};
  const after_value = {};

  for (const field of editableFields) {
    let newVal = donationData[field];


    if (field === "amount" && newVal !== undefined) newVal = Number(newVal) || 0;
    if (field === "currency" && newVal) newVal = newVal.toUpperCase();

    const oldVal = beforeRecord[field];

    if (newVal !== undefined && newVal !== oldVal) {
      updates.push(`${field} = ?`);
      updateParams.push(newVal);
      before_value[field] = oldVal;
      after_value[field] = newVal;
    }
  }

  if (updates.length === 0)
    return { success: true, message: "No changes detected." };

  updateParams.push(id);
  const sql = `UPDATE donations SET ${updates.join(", ")} WHERE id = ?`;

  try {
    await pool.query(sql, updateParams);


    await pool.query(
      `INSERT INTO audit_logs (entity_type, entity_id, changed_at, action, changed_by_username, before_value, after_value)
       VALUES (?, ?, NOW(), ?, ?, ?, ?)`,
      ["donation", id, "update", username, JSON.stringify(before_value), JSON.stringify(after_value)]
    );

    return { success: true, message: "Donation updated and audit log created." };
  } catch (error) {
    console.error("Database Update Error:", error.message);
    return { success: false, error: error.message };
  }
}
