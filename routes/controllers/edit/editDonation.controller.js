import handleTokens from "../../adminFunctions/handleTokens.js";
import { editDonation } from "../../models/edit/editDonation.model.js";

export async function editDonoationController(req, res) {
  const { donationData } = req.body;

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

  const result = await editDonation(donationData, decoded.username);

  if (result.success) return res.status(201).json({ message: result.message });

  return res.status(500).json({ error: result.error || result.message });
}
