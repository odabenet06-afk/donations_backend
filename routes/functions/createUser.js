import pool from "../../db/db.js";
import handleEncryption from "./bcrypt.js";

const createUser = async (userData) => {
  try {
    const hashedPassword = await handleEncryption.hashPassword(
      userData.password,
    );

    const [result] = await pool.query(
      `INSERT INTO users (username, password_hash, role, created_at) VALUES (?, ?, ?, NOW())`,
      [userData.username, hashedPassword, userData.role],
    );

    return { success: true, id: result.insertId };
  } catch (error) {
    console.error("Error creating user:", error.message);
    return { success: false, error: error.message };
  }
};

/*
console.log(
  await createUser({
    username: "Benet",
    password: "benet123",
    role: "staff",
  }),
);
*/
export default createUser;
