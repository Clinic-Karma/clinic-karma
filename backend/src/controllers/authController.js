import { addPatient } from "../db_utils/patient.js";
import { validationResult } from 'express-validator';
import { checkUser, storeRefreshToken, checkRefreshToken, deleteRefreshToken, deleteAllRefreshTokensForUser } from "../db_utils/user.js";
import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from "../utils/token.js";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export async function registerPatient(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    try {
        const result = await addPatient(req.body);
        return res.status(201).json({ success: true });
    }
    catch (err) {
        return res.status(500).json({
            message: err.detail || err.message || "Internal Server Error"
        });
    }
}

export async function login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { username, password } = req.body;

    try {
        const user = await checkUser(username);
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });

        const sessionId = uuidv4();
        const payload = { sub: user.user_id, role: user.user_type, sid: sessionId, jti: uuidv4() };
        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken(payload);

        await storeRefreshToken(user.user_id, refreshToken, payload.jti);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
          });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        });

        return res.json({
        user: { id: user.user_id, username: user.username, email: user.email, role: user.user_type }
        });

    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
  }
}

export async function refreshAccessToken(req, res) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'Missing token' });
  
    try {
      // Verify the JWT structure/signature
      const payload = verifyRefreshToken(refreshToken);

      // Check token existence (hashed) in DB
      const tokenInDB = await checkRefreshToken(refreshToken);

      // Reuse detection: if JWT verifies but DB has no matching token, assume compromise
      if (!tokenInDB || tokenInDB.length === 0 || tokenInDB[0]?.revoked === true) {
        // Revoke all tokens for this user to contain the incident
        await deleteAllRefreshTokensForUser(payload.sub);
        return res.status(403).json({ message: 'Refresh token reuse detected' });
      }

      // Rotate: delete old jti, issue new tokens
      await deleteRefreshToken(payload.jti);

      const newJti = uuidv4();
      const newPayload = { sub: payload.sub, sid: payload.sid, jti: newJti };
      const newAccessToken = signAccessToken(newPayload);
      const newRefreshToken = signRefreshToken(newPayload);

      await storeRefreshToken(payload.sub, newRefreshToken, newJti);

      res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
          });

      res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      });

      // No body needed; cookies carry the tokens
      return res.status(204).end();
    } catch (err) {
      console.error(err);
      return res.status(403).json({ message: 'Invalid token' });
    }
  }

  export async function logout(req, res) {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (refreshToken) {
            try {
                const payload = verifyRefreshToken(refreshToken);
                await deleteRefreshToken(payload.jti);
            } catch (e) {
                // ignore invalid/expired token on logout
            }
        }

        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        return res.status(204).end();
    } catch (err) {
        return res.status(204).end();
    }
}