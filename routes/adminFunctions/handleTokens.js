import jwt from "jsonwebtoken";

const handleTokens = {
  generateToken: (role, secret, username) => {
    return jwt.sign({ role, username }, secret, { expiresIn: "1d" });
  },

  checkToken: (token, secret) => {
    return jwt.verify(token, secret);
  },
};

//console.log(handleTokens.generateToken("admin", "p7QvJt3K9rEwFZ2N8mA5YxD6C4HBLu0S", "test_admin"))

export default handleTokens;
