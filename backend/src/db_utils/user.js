import { sql } from "./db.js"
import crypto from 'crypto';

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function checkUser(username) {
    try {
        const result = await sql`SELECT User_ID, Username, Password_Hash, User_type FROM "User"
                                 WHERE username = ${username}`;
        
        const user = result[0];
        return user;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

export async function storeRefreshToken(user_id, refreshToken, jti) {
    try {
        const hashedToken = hashToken(refreshToken);

        await sql`
            INSERT INTO refresh_tokens (user_id, token, jti, expires_at, revoked)
            VALUES (${user_id}, ${hashedToken}, ${jti}, NOW() + interval '30 days', false)
        `;
    }
        catch (err) {
        console.log(err);
        throw err;
    }
}

export async function checkRefreshToken(refreshToken) {
    try {
        const hashedToken = hashToken(refreshToken);
        const result = await sql`SELECT * FROM refresh_tokens WHERE token = ${hashedToken}`;
        return result;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

export async function deleteRefreshToken(jti) {
    try {
        await sql`DELETE FROM refresh_tokens WHERE jti = ${jti}`;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

export async function deleteAllRefreshTokensForUser(user_id) {
    try {
        await sql`DELETE FROM refresh_tokens WHERE user_id = ${user_id}`;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}