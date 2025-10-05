import { checkUser } from "../db_utils/db.js";
import { addPatient } from "../db_utils/patient.js";
import { validationResult } from 'express-validator';
import { checkUser, storeRefreshToken } from "../db_utils/user.js";
import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from "../utils/token.js";

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
        const payload = { sub: user.user_id, role: user.user_type, sid: sessionId };
        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken(payload);

        storeRefreshToken(user.user_id, refreshToken);

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
