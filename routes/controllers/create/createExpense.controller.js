import handleTokens from "../../adminFunctions/handleTokens.js";
import { createExpense } from "../../models/create/createExpense.model.js";
import { toggleReload } from "../../../index.js";
import { createExpenseSchema } from "../../schemas/index.js";

export async function createExpenseController(req, res) {
  const result = createExpenseSchema.safeParse(req.body.expenseData);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.errors,
    });
  }

  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "Missing token" });

  const token = authHeader.split(" ")[1];
  let decoded;
  try {
    decoded = handleTokens.checkToken(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }

  const dbResult = await createExpense(result.data, decoded.username);

  if (dbResult.success) {
    toggleReload();
    return res
      .status(201)
      .json({ message: "Expense created", id: dbResult.id });
  }

  return res.status(500).json({ error: dbResult.error });
}
