import express from "express";
import pool from "../db/db.js";

const router = express.Router();

router.get("/load", async (req, res) => {
  const year = Number(req.query.year);
  const month = req.query.month ? Number(req.query.month) : null;

  if (!year) {
    return res.status(400).json({
      success: false,
      error: "Year is required",
    });
  }

  let startDate;
  let endDate;

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

  try {
    const [donations] = await pool.query(
      `SELECT 
        d.amount, 
        d.created_at, 
        d.donor_name,
        d.currency,
        d.donation_purpose,
        dr.first_name, 
        dr.last_name, 
        dr.privacy_preference,
        dr.donor_public_id
       FROM donations d
       LEFT JOIN donors dr ON d.donor_id = dr.id
       WHERE d.status = 'active'
         AND d.created_at >= ?
         AND d.created_at < ?
       ORDER BY d.id DESC`,
      [startDate, endDate]
    );

    const [expenses] = await pool.query(
      `SELECT 
         e.amount, 
         e.description, 
         e.created_at, 
         e.project_name, 
         e.category
       FROM expenses e
       WHERE e.status = 'active'
         AND e.created_at >= ?
         AND e.created_at < ?
       ORDER BY e.id DESC`,
      [startDate, endDate]
    );

    const [projects] = await pool.query(
      `SELECT * FROM projects ORDER BY id DESC`
    );

    const [system_stats] = await pool.query(
      `SELECT * FROM system_stats WHERE id = 1`
    );

    const mappedDonations = donations.map((d) => ({
      amount: d.amount,
      date: d.created_at,
      purpose: d.donation_purpose,
      currency: d.currency,
      donor:
        d.privacy_preference === "SHOW_NAME_PUBLICLY"
          ? `${d.first_name} ${d.last_name}`
          : d.donor_public_id,
    }));

    const mappedExpenses = expenses.map((e) => ({
      amount: e.amount,
      category: e.category,
      description: e.description,
      purpose: e.project_name || "General",
      date: e.created_at,
    }));

    const mappedProjects = projects.map((p) => ({
      name: p.name,
      description: p.description,
    }));

    const mappedSystemStats = {
      total_donors: system_stats[0]?.total_donors || 0,
      donationsCount: system_stats[0]?.total_donations_count || 0,
      raised: system_stats[0]?.total_amount_received || 0,
      spent: system_stats[0]?.total_amount_spent || 0,
      lastUpdate: system_stats[0]?.last_updated,
    };

    res.status(200).json({
      success: true,
      data: {
        donations: mappedDonations,
        expenses: mappedExpenses,
        projects: mappedProjects,
        system_stats: mappedSystemStats,
      },
    });
  } catch (error) {
    console.error("Mapping Error:", error.message);
    res.status(500).json({ success: false, error: "Data processing failed" });
  }
});

export default router;
