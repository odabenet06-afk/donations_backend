import { authUser } from "../models/auth.model.js";
import handleTokens from "../adminFunctions/handleTokens.js";

export async function authController(req, res) {
  const { username, password } = req.body;

  const result = await authUser(username, password);

  if (!result.success) {
    return res.status(401).json({ message: result.message });
  }

  const token = handleTokens.generateToken(
    result.user.role,
    process.env.JWT_SECRET,
    result.user.username
  );

  return res.status(200).json({
    token,
    username: result.user.username,
    role: result.user.role,
  });
}
