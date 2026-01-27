import {
  getDonations,
  getExpenses,
  getProjects,
} from "../../models/load/load.model.js";

export async function loadData(req, res) {
  const year = Number(req.query.year);
  const month = req.query.month ? Number(req.query.month) : null;
  const search =
    req.query.search?.trim().length > 0 ? req.query.search.trim() : null;

  if (!year) {
    return res.status(400).json({ success: false, error: "Year is required" });
  }

  const startDate = month
    ? `${year}-${String(month).padStart(2, "0")}-01`
    : `${year}-01-01`;

  const endDate = month
    ? month === 12
      ? `${year + 1}-01-01`
      : `${year}-${String(month + 1).padStart(2, "0")}-01`
    : `${year + 1}-01-01`;

  try {
    const donations = await getDonations(startDate, endDate, search);
    const expenses = await getExpenses(startDate, endDate);
    const projects = await getProjects();
    res.json({
      success: true,
      data: {
        donations,
        expenses,
        projects,
      },
    });
  } catch (err) {
    console.error("Dashboard Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}
