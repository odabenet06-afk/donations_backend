import handleTokens from "../../adminFunctions/handleTokens.js";
import { loadProjects } from "../../models/load/loadProjects.model.js";

export async function loadProjectsController(req, res) {
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

  try {
    const projects = await loadProjects();
    return res.status(200).json({ success: true, data: projects });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
