import { pool } from '../config/database.js';

// TypeScript types for User
export interface User {
  id?: number;
  email: string;
  password_hash: string;
  name: string;
  role?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateUserInput {
  email: string;
  password_hash: string;
  name: string;
  role?: string;
}

// User Model - CRUD Operations
export const User = {
  async create(input: CreateUserInput): Promise<User> {
    // Your implementation here
    const { email, password_hash, name, role } = input;
    
    const res = await pool.query(
      'INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, password_hash, name, role || 'user']
    )
    return res.rows[0];
  },

  async findByEmail(email: string): Promise<User | null> {
    const res = await pool.query(
      'SELECT * FROM users WHERE email = $1 LIMIT 1',
      [email]
    )
    return res.rows.length > 0 ? res.rows[0] : null;
  },

  async findById(id: number): Promise<User | null> {
    const res = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    )
    return res.rows.length > 0 ? res.rows[0] : null;
  }
};

export default User;
