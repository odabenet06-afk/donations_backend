import pool from "../../../db/db.js";

export async function createExpense(expenseData, username) {
  const {
    amount,
    currency,
    category,
    description,
    project_name,
    attachment_url,
  } = expenseData;

  try {
    const [result] = await pool.query(
      `INSERT INTO expenses (
        amount, currency, category, description, project_name, attachment_url,
        created_by_username, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        amount,
        currency,
        category,
        description,
        project_name,
        attachment_url,
        username,
      ],
    );

    await pool.query(
      `UPDATE system_stats SET total_amount_spent = total_amount_spent + ? WHERE id = 1`,
      [amount],
    );

    await pool.query(
      `INSERT INTO audit_logs (entity_type, entity_id, changed_at, action, changed_by_username)
       VALUES (?, ?, NOW(), ?, ?)`,
      ["expense", result.insertId, "create", username],
    );

    console.log("Expense created with ID:", result.insertId);
    return { success: true, id: result.insertId };
  } catch (error) {
    console.error("Error creating expense:", error.message);
    return { success: false, error: error.message };
  }
}
