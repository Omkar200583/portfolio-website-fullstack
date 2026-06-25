import { generateAccessToken, generateRefreshToken } from "../config/jwt.js";

/**
 * Generates both tokens for a user and returns them together.
 */
export const generateTokenPair = (userId) => ({
  accessToken: generateAccessToken(userId),
  refreshToken: generateRefreshToken(userId),
});