import handleTokens from "../../adminFunctions/handleTokens.js";
import { loadLogs } from "../../models/load/loadLogs.model.js";

export async function loadLogsController(req, res) {
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

  if (decoded.role !== "admin")
    return res.status(403).json({ message: "Permission denied" });

  const from = req.query.from || null;
  const to = req.query.to || null;

  try {
    const logs = await loadLogs(from, to);
    return res.status(200).json({ success: true, data: logs });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
