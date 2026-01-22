import pool from "../../db/db.js";
import handleEncryption from "./bcrypt.js";

const auth = async (username, password) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [
    username,
  ]);

  if (rows.length === 0) {
    return { success: false, message: "User not found" };
  }

  const user = rows[0];

  console.log("DB HASH:", user.password_hash);

  const isAuthorised = await handleEncryption.comparePassword(
    password,
    user.password_hash,
  );

  if (!isAuthorised) {
    return { success: false, message: "Invalid password" };
  }

  return {
    success: true,
    user,
  };
};

/*
console.log(await auth("test_admin", "test123"));
*/
export default auth;