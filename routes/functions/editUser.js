import pool from "../../db/db.js";
import handleEncryption from "./bcrypt.js";

const editUser = async (userData) => {
  try {
    const hashedPassword = await handleEncryption.hashPassword(
      userData.password,
    );

    const [result] = await pool.query(
      `UPDATE users 
       SET username = ?, password_hash = ?, role = ? 
       WHERE username = ?`,
      [userData.username, hashedPassword, userData.role, userData.before],
    );

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: `User '${userData.before}' not found.`,
      };
    }

    return {
      success: true,
      message: `User '${userData.before}' updated successfully.`,
    };
  } catch (error) {
    console.error("Error editing user:", error.message);
    return { success: false, error: error.message };
  }
};

/*
console.log(
  await editUser({
    before: "Benet",
    username: "Dorant",
    password: "Dorant123",
    role: "staff",
  }),
);
*/
export default editUser;
