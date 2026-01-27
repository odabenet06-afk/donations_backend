import pool from "../../../db/db.js";

export async function voidExpense(id) {
  try {
    const [expenseRows] = await pool.query(
      `SELECT amount FROM expenses WHERE id = ?`,
      [id],
    );

    if (expenseRows.length === 0) {
      return { success: false, message: "Expense not found." };
    }

    const [result] = await pool.query(
      `UPDATE expenses 
       SET status = 'void'
       WHERE id = ? `,
      [id],
    );

    const amount = expenseRows[0].amount;

    await pool.query(
      `UPDATE system_stats SET total_amount_spent = total_amount_spent - ? WHERE id = 1`,
      [amount],
    );

    return {
      success: true,
      message: `Expense updated successfully.`,
    };
  } catch (error) {
    console.error("Error editing expense:", error.message);
    return { success: false, error: error.message };
  }
}
