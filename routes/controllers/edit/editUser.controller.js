import handleTokens from "../../adminFunctions/handleTokens.js";
import { editUser } from "../../models/edit/editUser.model.js";

export async function editUserController(req, res) {
  const { userData } = req.body;

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

  const result = await editUser(userData);

  if (result.success)
    return res.status(201).json({ message: "User edited successfully" });

  return res.status(500).json({ error: result.error || result.message });
}
