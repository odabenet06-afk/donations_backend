import pool from "../../db/db.js";

const editDonor = async (donorData, userId) => {
  const { donor_public_id } = donorData;

  const [rows] = await pool.query(
    `SELECT * FROM donors WHERE donor_public_id = ?`,
    [donor_public_id],
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

  updateParams.push(donor_public_id);
  const sql = `UPDATE donors SET ${updates.join(", ")} WHERE donor_public_id = ?`;

  try {
  
    await pool.query(sql, updateParams);

   
    await pool.query(
      `INSERT INTO audit_logs (entity_type, entity_id, changed_at, action, changed_by_username, before_value, after_value) 
       VALUES (?, ?, NOW(), ?, ?, ?, ?)`,
      [
        "donor",
        donor_public_id,
        "update",
        userId,
        JSON.stringify(before_value),
        JSON.stringify(after_value),
      ],
    );

    return {
      success: true,
      message:
        "Donor updated. Audit log created with separate before/after columns.",
    };
  } catch (error) {
    console.error("Database Update Error:", error.message);
    throw error;
  }
};

/*

const testData = {
  donor_public_id: "DNR-00000001",
  first_name: "Ben",
  email: "ben.new@gmail.com", 
  phone: "123456789", 
  notes: "Testing separate logs",
};

const mockUserId = 99; 


editDonor(testData, mockUserId)
  .then((result) => {
    console.log("RESULT:", result.message);
    if (result.changes_detected) {
      console.log("LOGGED BEFORE:", result.changes_detected.before_value);
      console.log("LOGGED AFTER:", result.changes_detected.after_value);
    }
    process.exit(0);
  })
  .catch((err) => {
    console.error("TEST FAILED:", err.message);
    process.exit(1);
  });
  */

export default editDonor
