import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database connection configuration
const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 20, // maximum pool size
    idleTimeoutMillis: 30000, // 30 seconds
    connectionTimeoutMillis: 2000, // 2 seconds
});

export { pool };

// Test the connection
export async function testConnection() {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Database connection successful:', res.rows[0]);
    } catch (error) {
        console.error('Database connection test failed:', error);
    }
}