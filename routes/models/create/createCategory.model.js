import pool from "../../../db/db.js";

export async function createCategory(categoryData) {
  try {
    const [result] = await pool.query(
      `INSERT INTO category (en, sq, mk, created_at) 
       VALUES (?, ?, ?, NOW())`,
      [categoryData.en, categoryData.sq, categoryData.mk],
    );

    return { success: true, id: result.insertId };
  } catch (error) {
    console.error("Error creating category:", error.message);
    return { success: false, error: error.message };
  }
}
