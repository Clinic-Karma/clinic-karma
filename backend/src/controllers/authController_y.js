import { addPatient, getPatientID  } from "../db_utils/patient_y.js";
import { validationResult } from 'express-validator';
import { checkUser, storeRefreshToken, checkRefreshToken, deleteRefreshToken, deleteAllRefreshTokensForUser, getStaffID } from "../db_utils/user_y.js";
import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from "../utils/token.js";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';


// Cookie options helper to handle dev vs prod cross-site behavior
function getCookieOptions() {
    const isProd = process.env.NODE_ENV === 'production';
    return {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax'
    };
}

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
        let ID = "";

        if (user.user_type == "patient") ID = await getPatientID(user.user_id);
        else ID = await getStaffID(user.user_id);

        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });

        const sessionId = uuidv4();
        const payload = { sub: user.user_id, role: user.user_type, sid: sessionId, jti: uuidv4() };
        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken(payload);

        await storeRefreshToken(user.user_id, refreshToken, payload.jti);

        const baseCookie = getCookieOptions();
        res.cookie('accessToken', accessToken, {
            ...baseCookie,
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        res.cookie('refreshToken', refreshToken, {
            ...baseCookie,
            maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
        });

        return res.json({
        user: { id: user.user_id, pid: ID, username: user.username, role: user.user_type, name: user.name }
        });

    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
  }
}

export async function refreshAccessToken(req, res) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: 'Missing token' });
    }
  
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
      try {
        await deleteRefreshToken(payload.jti);
      } catch (deleteErr) {
        // Continue with token rotation even if deletion fails
      }

      const newJti = uuidv4();
      const newPayload = { sub: payload.sub, role: payload.role, sid: payload.sid, jti: newJti };
      const newAccessToken = signAccessToken(newPayload);
      const newRefreshToken = signRefreshToken(newPayload);

      try {
        await storeRefreshToken(payload.sub, newRefreshToken, newJti);
      } catch (storeErr) {
        return res.status(500).json({ message: 'Failed to store refresh token' });
      }

      const baseCookie = getCookieOptions();
      res.cookie('accessToken', newAccessToken, {
            ...baseCookie,
            maxAge: 15 * 60 * 1000 // 15 minutes
      });

      res.cookie('refreshToken', newRefreshToken, {
            ...baseCookie,
            maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
      });

      // Return new access token in response body for immediate use
      return res.status(200).json({ 
        accessToken: newAccessToken,
        message: 'Tokens refreshed successfully' 
      });
    } catch (err) {
      console.error('refreshAccessToken error:', err?.message || err);
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

        const baseCookie = getCookieOptions();
        res.clearCookie('accessToken', {
            ...baseCookie
        });
        res.clearCookie('refreshToken', {
            ...baseCookie
        });

        return res.status(204).end();
    } catch (err) {
        return res.status(204).end();
    }
}