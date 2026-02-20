import handleTokens from "../../adminFunctions/handleTokens.js";
import { createCategory} from "../../models/create/createCategory.model.js";

export async function createCategoryController(req, res) {
  const { categoryData } = req.body;

  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "Missing token" });

  const token = authHeader.split(" ")[1];
  let decoded;
  try {
    decoded = handleTokens.checkToken(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }

  const dbResult = await createCategory(categoryData);

  if (dbResult.success) {
    return res
      .status(201)
      .json({ message: "Category created", id: dbResult.id });
  }

  return res.status(500).json({ error: dbResult.error });
}
