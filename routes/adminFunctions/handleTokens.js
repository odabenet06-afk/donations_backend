import jwt from "jsonwebtoken";

const handleTokens = {
  generateToken: (role, secret, username) => {
    return jwt.sign({ role, username }, secret, { expiresIn: "1d" });
  },

  checkToken: (token, secret) => {
    return jwt.verify(token, secret);
  },
};


export default handleTokens;
