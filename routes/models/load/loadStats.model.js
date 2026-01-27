import pool from "../../../db/db.js";

export async function getSystemStats() {
  const [[s]] = await pool.query(`SELECT * FROM system_stats WHERE id = 1`);
  return {
    total_donors: s?.total_donors || 0,
    donationsCount: s?.total_donations_count || 0,
    raised: s?.total_amount_received || 0,
    spent: s?.total_amount_spent || 0,
    lastUpdate: s?.last_updated,
  };
}
