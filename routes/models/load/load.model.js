import pool from "../../../db/db.js";

export async function getDonations(startDate, endDate, search) {
  let query = `
    SELECT d.*, dr.first_name, dr.last_name, dr.privacy_preference, dr.donor_public_id
    FROM donations d
    LEFT JOIN donors dr ON d.donor_id = dr.donor_public_id
    WHERE d.status = 'active'
      AND d.created_at >= ?
      AND d.created_at < ?
  `;

  const params = [startDate, endDate];

  if (search) {
    query += `
      AND CONCAT(dr.first_name, ' ', dr.last_name) LIKE ?
      AND dr.privacy_preference = 'SHOW_NAME_PUBLICLY'
    `;
    params.push(`%${search}%`);
  }

  query += " ORDER BY d.id DESC";

  const [rows] = await pool.query(query, params);

  return rows.map((d) => ({
    amount: d.amount,
    date: d.created_at,
    purpose: d.donation_purpose,
    currency: d.currency,
    donor:
      d.privacy_preference === "SHOW_NAME_PUBLICLY"
        ? `${d.first_name} ${d.last_name}`
        : d.donor_public_id,
  }));
}

export async function getExpenses(startDate, endDate) {
  const [rows] = await pool.query(
    `SELECT * FROM expenses
     WHERE status='active' AND created_at >= ? AND created_at < ?
     ORDER BY id DESC`,
    [startDate, endDate],
  );

  return rows.map((e) => ({
    amount: e.amount,
    category: e.category,
    description: e.description,
    purpose: e.project_name || "General",
    date: e.created_at,
  }));
}

export async function getProjects() {
  const [rows] = await pool.query(`SELECT * FROM projects ORDER BY id DESC`);
  return rows.map((p) => ({ name: p.name, description: p.description }));
}


