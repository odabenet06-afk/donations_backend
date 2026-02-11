import pool from "../../../db/db.js";

export async function createDonor(donorData, username) {
  const { first_name, last_name, email, privacy_preference, phone, notes } =
    donorData;

  try {

    const [rows] = await pool.query(
      `SELECT MAX(id) as maxId FROM donors`,
    );
    const nextNumber = (rows[0]?.maxId || 0) + 1;
    const donor_public_id = `DNR-${nextNumber.toString().padStart(8, "0")}`;


    const [result] = await pool.query(
      `INSERT INTO donors (
        first_name, last_name, email, privacy_preference,
        created_at, donor_public_id, phone, notes
      ) VALUES (?, ?, ?, ?, NOW(), ?, ?, ?)`,
      [
        first_name,
        last_name,
        email,
        privacy_preference || "SHOW_NAME_PUBLICLY",
        donor_public_id,
        phone || null,
        notes || null,
      ],
    );

    const newId = result.insertId;

 
    await pool.query(
      `UPDATE system_stats SET total_donors = total_donors + 1 WHERE id = 1`,
    );

    await pool.query(
      `INSERT INTO audit_logs (entity_type, entity_id, changed_at, action, changed_by_username)
       VALUES (?, ?, NOW(), ?, ?)`,
      ["donor", donor_public_id, "create", username],
    );

    console.log("Donor created with ID:", newId);
    return {
      success: true,
      id: newId,
      public_id: donor_public_id,
    };
  } catch (error) {

    console.error("Error creating donor:", error.message);

    const errorMsg = error.message.includes("Duplicate entry")
      ? "Conflict: This Donor ID already exists. Please try again."
      : error.message;

    return { success: false, error: errorMsg };
  }
}