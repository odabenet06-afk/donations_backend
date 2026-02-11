import pool from "../../../db/db.js";

export async function editDonor(donorData, username) {
  const { donor_public_id, id } = donorData;
  const identifier = donor_public_id || id;

  if (!identifier) {
    return { success: false, message: "Donor identifier missing" };
  }

  try {
    const [rows] = await pool.query(
      `SELECT * FROM donors WHERE ${donor_public_id ? "donor_public_id" : "id"} = ?`,
      [identifier],
    );

    const beforeRecord = rows[0];
    if (!beforeRecord) {
      return { success: false, message: "Donor not found" };
    }

    const editableFields = [
      "first_name",
      "last_name",
      "email",
      "privacy_preference",
      "phone",
      "notes",
    ];
    const updates = [];
    const updateParams = [];
    const before_value = {};
    const after_value = {};

    for (const field of editableFields) {
      const newVal = donorData[field];
      const oldVal = beforeRecord[field];

      if (newVal !== undefined && newVal !== oldVal) {
        updates.push(`${field} = ?`);
        updateParams.push(newVal);
        before_value[field] = oldVal;
        after_value[field] = newVal;
      }
    }

    if (updates.length === 0) {
      return { success: true, message: "No changes detected." };
    }

    updateParams.push(identifier);
    const sql = `UPDATE donors SET ${updates.join(", ")} WHERE ${donor_public_id ? "donor_public_id" : "id"} = ?`;
    await pool.query(sql, updateParams);

    await pool.query(
      `INSERT INTO audit_logs (entity_type, entity_id, action, changed_at, changed_by_username, before_value, after_value)
       VALUES (?, ?, ?, NOW(), ?, ?, ?)`,
      [
        "donor",
        identifier,
        "update",
        username,
        JSON.stringify(before_value),
        JSON.stringify(after_value),
      ],
    );

    return { success: true, message: "Donor updated and audit log created." };
  } catch (error) {
    console.error("Database Update Error:", error.message);
    return { success: false, error: error.message };
  }
}
