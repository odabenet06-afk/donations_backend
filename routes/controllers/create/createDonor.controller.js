import handleTokens from "../../adminFunctions/handleTokens.js";
import { createDonor } from "../../models/create/createDonor.model.js";

export async function createDonorController(req, res) {
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

  const result = await createDonor(donorData, decoded.username);

  if (result.success)
    return res.status(201).json({ message: "Donor created", id: result.id });

  return res.status(500).json({ error: result.error });
}
