import pool from "../../db/db.js";

const deleteUser = async (username) => {
  try {
    const [result] = await pool.query(`DELETE FROM users WHERE username = ?`, [
      username,
    ]);

    return {
      success: true,
      message: `User '${username}' deleted successfully.`,
    };
  } catch (error) {
    console.error("Error deleting user:", error.message);
    return { success: false, error: error.message };
  }
};

//console.log(await deleteUser("Dorant"))

export default deleteUser;
