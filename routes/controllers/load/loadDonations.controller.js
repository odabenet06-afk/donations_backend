import handleTokens from "../../adminFunctions/handleTokens.js";
import { loadDonations } from "../../models/load/loadDonations.model.js";

export async function loadDonationsController(req, res) {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ message: "Missing authorization header" });

  const token = authHeader.split(" ")[1];
  let decoded;
  try {
    decoded = handleTokens.checkToken(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }

  const year = req.query.year ? Number(req.query.year) : null;
  const month = req.query.month ? Number(req.query.month) : null;
  const search = req.query.search || null;

  try {
    const donations = await loadDonations(year, month, search);
    return res.status(200).json({ success: true, data: donations });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
