import handleTokens from "../../adminFunctions/handleTokens.js";
import { createExpense } from "../../models/create/createExpense.model.js";
import { toggleReload } from "../../../index.js";

export async function createExpenseController(req, res) {
  const { expenseData } = req.body;

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

  const result = await createExpense(expenseData, decoded.username);
  toggleReload();
  if (result.success)
    return res.status(201).json({ message: "Expense created", id: result.id });

  return res.status(500).json({ error: result.error });
}
