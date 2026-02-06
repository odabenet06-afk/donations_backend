import bcrypt from "bcrypt";

const handleEncryption = {
  hashPassword: async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  },
  comparePassword: async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
  },
};


console.log(await handleEncryption.hashPassword("admin123"))
console.log(await handleEncryption.comparePassword("test123", "$2b$10$.iKnZXPPK0kMtksmN8AZc.oWtmDvIIZ0mXnNcedvpin6qZBVQVFt."))

export default handleEncryption;
