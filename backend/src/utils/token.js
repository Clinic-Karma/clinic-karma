import jwt from 'jsonwebtoken';
import { requireEnvironmentVariable } from '../config/env.js';

export function signAccessToken(payload) {
  return jwt.sign(payload, requireEnvironmentVariable('ACCESS_TOKEN_SECRET'), {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m'
  });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, requireEnvironmentVariable('REFRESH_TOKEN_SECRET'), {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES || '30d'
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, requireEnvironmentVariable('ACCESS_TOKEN_SECRET'));
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, requireEnvironmentVariable('REFRESH_TOKEN_SECRET'));
}
