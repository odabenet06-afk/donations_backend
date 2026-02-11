import handleTokens from "../../adminFunctions/handleTokens.js";
import { editDonor } from "../../models/edit/editDonor.model.js";

export async function editDonorController(req, res) {
  const { donorData } = req.body;

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

  const result = await editDonor(donorData, decoded.username);

  if (result.success)
    return res
      .status(201)
      .json({
        message: result.message,
        id: result.id,
        public_id: result.public_id,
      });

  return res.status(500).json({ error: result.error || result.message });
}
