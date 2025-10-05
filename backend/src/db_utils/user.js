import { sql } from "./db.js"

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

export async function storeRefreshToken(user_id, refreshToken) {
    try {
        // Store refresh token in DB
        await sql`
            INSERT INTO refresh_tokens (user_id, token, expires_at)
            VALUES (${user_id}, ${refreshToken}, NOW() + interval '30 days')
        `;
    }
        catch (err) {
        console.log(err);
        throw err;
    }
}