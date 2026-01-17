import { pool } from '../config/database.js';

// TypeScript types for Project
export interface Project {
  id?: number;
  user_id?: number | null;
  name: string;
  description?: string | null;
  image_url?: string | null;
  contract_type_id?: number | null;
  contract_signed_on?: Date | null;
  budget?: number;
  is_active?: boolean;
  status?: string;
  order?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateProjectInput {
  user_id?: number | null;
  name: string;
  description?: string;
  image_url?: string;
  contract_type_id?: number;
  contract_signed_on?: Date;
  budget?: number;
  is_active?: boolean;
  status?: string;
  order?: number;
}

// Project Model - CRUD Operations
export const Project = {
   async create(input: CreateProjectInput): Promise<Project> {
    const { user_id, name, description, image_url, contract_type_id, contract_signed_on, budget, is_active, status, order } = input;

    const res = await pool.query(
      `INSERT INTO projects (user_id, name, description, image_url, contract_type_id, contract_signed_on, budget, is_active, status, "order")`
      + ` VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [user_id, name, description, image_url, contract_type_id, contract_signed_on, budget, is_active, status, order]
    )
    return res.rows[0];
  },

  // findAll function - get all projects with optional filters
  async findAll(filters?: { user_id?: number; status?: string; is_active?: boolean }): Promise<Project[]> {
    let query = 'SELECT * FROM projects WHERE 1=1';
    const values: any[] = [];
    let paramIndex = 1;

    if (filters?.user_id) {
      query += ` AND user_id = $${paramIndex++}`;
      values.push(filters.user_id);
    }
    if (filters?.status) {
      query += ` AND status = $${paramIndex++}`;
      values.push(filters.status);
    }
    if (filters?.is_active !== undefined) {
      query += ` AND is_active = $${paramIndex++}`;
      values.push(filters.is_active);
    }
    query += ' ORDER BY "order" ASC, id DESC';

    const res = await pool.query(query, values);
    return res.rows;
  },

  async findById(id: number): Promise<Project | null> {
    const res = await pool.query(
      `SELECT * FROM projects WHERE id = $1`,
      [id]
    )
    return res.rows.length > 0 ? res.rows[0] : null;
  },

  async update(id: number, updates: Partial<CreateProjectInput>): Promise<Project | null> {
    const setFields = [];
    const values = []
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updates)) {
      setFields.push(`${key} = $${paramIndex++}`);
      values.push(value);
    }
    if (setFields.length === 0) {
      return this.findById(id); // Nothing to update
    }
    const res = await pool.query(
      `UPDATE projects SET ${setFields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      [...values, id]
    )
    return res.rows.length > 0 ? res.rows[0] : null;
  },

  async delete(id: number): Promise<Project | null> {
    const res = await pool.query(
      `DELETE FROM projects WHERE id = $1 RETURNING *`,
      [id]
    )
    return res.rows.length > 0 ? res.rows[0] : null;
  }
};

export default Project;
