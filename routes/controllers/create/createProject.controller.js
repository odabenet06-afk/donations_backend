import handleTokens from "../../adminFunctions/handleTokens.js";
import { createProject } from "../../models/create/createProject.model.js";

export async function createProjectController(req, res) {
  const { name, description, status, start_date, end_date } = req.body;

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

  const result = await createProject(
    name,
    description,
    status,
    start_date,
    end_date,
  );

  if (result.success)
    return res.status(201).json({ message: "Project created", id: result.id });

  return res.status(500).json({ error: result.error });
}
