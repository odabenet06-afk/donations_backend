import pool from "../../../db/db.js";

export async function loadDonations(year = null, month = null, search = null) {
  let query = `SELECT * FROM donations WHERE status != 'void'`;
  const params = [];

  if (year) {
    let startDate, endDate;

    if (month) {
      startDate = `${year}-${String(month).padStart(2, "0")}-01`;
      endDate =
        month === 12
          ? `${year + 1}-01-01`
          : `${year}-${String(month + 1).padStart(2, "0")}-01`;
    } else {
      startDate = `${year}-01-01`;
      endDate = `${year + 1}-01-01`;
    }

    query += ` AND created_at >= ? AND created_at < ?`;
    params.push(startDate, endDate);
  }

  if (search && search.trim().length > 0) {
    if (params.length === 0) {
      query += ` AND donor_name LIKE ?`;
    } else {
      query += ` AND donor_name LIKE ?`;
    }
    params.push(`%${search.trim()}%`);
  }

  const [rows] = await pool.query(query, params);
  return rows;
}
