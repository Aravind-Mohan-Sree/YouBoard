import jwt from "jsonwebtoken";

const generateAccessToken = (userId: string, role: string): string => {
  return jwt.sign({ userId, role }, process.env.ACCESS_SECRET!, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.REFRESH_SECRET!, { expiresIn: "7d" });
};

export { generateAccessToken, generateRefreshToken };
