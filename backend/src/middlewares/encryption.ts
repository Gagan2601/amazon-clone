import bcrypt from "bcrypt";
const saltRounds = 10;

// Function to hash a password
export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, saltRounds);
};

// Function to verify a password
export const verifyPassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};
