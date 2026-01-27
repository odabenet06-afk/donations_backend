import pool from "../../../db/db.js";

export async function createProject(name, description, status, startDate, endDate) {
  try {
    const [result] = await pool.query(
      `INSERT INTO projects (name, description, status, start_date, end_date, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [name, description, status, startDate, endDate]
    );

    return { success: true, id: result.insertId };
  } catch (error) {
    console.error("Error creating Project:", error.message);
    return { success: false, error: error.message };
  }
}
