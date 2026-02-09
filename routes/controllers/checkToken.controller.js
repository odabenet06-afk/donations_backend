import { checkToken } from "../models/checkToken.model.js";
import handleTokens from "../adminFunctions/handleTokens.js";

export async function checkTokenController(req, res) {
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

  const result = await checkToken(decoded.username);

  if (!result.success) {
    return res.status(401).json({ message: result.message });
  }

  return res.status(200).json({
    username: result.user.username,
    role: result.user.role,
  });
}
