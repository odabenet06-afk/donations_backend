import pool from "../../../db/db.js";

export async function loadDonors(year = null, month = null, search = null) {
  let query = `SELECT * FROM donors `;
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

    query += ` WHERE created_at >= ? AND created_at < ?`;
    params.push(startDate, endDate);
  }

  if (search && search.trim().length > 0) {
    const searchTerm = `%${search.trim()}%`;

    if (params.length === 0) {
      query += ` WHERE CONCAT(first_name, ' ', last_name) LIKE ?`;
    } else {
      query += ` AND CONCAT(first_name, ' ', last_name) LIKE ?`;
    }

    params.push(searchTerm);
  }

  const [rows] = await pool.query(query, params);
  return rows;
}
