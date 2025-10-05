import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection pool to the PostgreSQL database using Neon
export const sql = neon(
    process.env.DATABASE_URL
);