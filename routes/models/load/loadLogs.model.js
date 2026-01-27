import pool from "../../../db/db.js";

export async function loadLogs(startDate = null, endDate = null) {
  let query = `SELECT * FROM audit_logs`;
  const params = [];

  if (startDate && endDate) {
    const startDateTime = `${startDate} 00:00:00`;
    const endDateTime = `${endDate} 23:59:59`;

    query += ` WHERE changed_at >= ? AND changed_at <= ?`;
    params.push(startDateTime, endDateTime);
  }

  const [rows] = await pool.query(query, params);
  return rows;
}
