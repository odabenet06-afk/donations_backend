import handleTokens from "../../adminFunctions/handleTokens.js";
import { getCategory} from "../../models/load/loadCategory.model.js";

export async function loadCategoryController(req, res) {
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
    const category = await getCategory();
    return res.status(200).json({ success: true, data: category });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
