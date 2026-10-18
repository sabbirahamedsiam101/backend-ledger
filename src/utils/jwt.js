import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { env } from '../config/env.js';
const refreshCookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/api/auth/refresh',
});

// console.log('JWT_ACCESS_SECRET:', env.JWT_ACCESS_SECRET);


const getSecret = (environmentVariable) => {
  const secret = process.env[environmentVariable];
  if (!secret) {
    throw new Error(`${environmentVariable} is not configured.`);
  }
  return secret;
};

/**
 * Generates both access & refresh tokens, secures the cookie, and updates the DB.
 * @param {Object} res - Express response object
 * @param {Object} user - Mongoose user document instance
 * @returns {Object} The short-lived access token
 */
export const sendTokenResponse = async (res, user) => {
  // 1. Generate short-lived Access Token (15 mins)
  const accessToken = jwt.sign(
    { id: user._id, role: user.role }, 
    getSecret('JWT_ACCESS_SECRET'),
    { expiresIn: '15m' }
  );

  // 2. Generate long-lived Refresh Token (7 days)
  const refreshToken = jwt.sign(
    { id: user._id, type: 'refresh' },
    getSecret('JWT_REFRESH_SECRET'),
    { expiresIn: '7d' }
  );

  // 3. Hash the refresh token before saving to database (Defends against DB leaks)
  user.refreshToken = await bcrypt.hash(refreshToken, 12);
  await user.save({ validateBeforeSave: false });

  // 4. The refresh token is only sent to the refresh endpoint.
  const cookieOptions = {
    ...refreshCookieOptions(),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);
  return accessToken;
};

export const clearRefreshTokenCookie = (res) => {
  res.clearCookie('refreshToken', refreshCookieOptions());
};

export const verifyAccessToken = (token) =>
  jwt.verify(token, getSecret('JWT_ACCESS_SECRET'));

export const verifyRefreshToken = (token) =>
  jwt.verify(token, getSecret('JWT_REFRESH_SECRET'));

export const compareRefreshToken = (token, hash) =>
  bcrypt.compare(token, hash);

getSecret('JWT_ACCESS_SECRET');