import { pool, toCamelCase } from '../config/database.js';
import { Tag, Department } from '../types/index.js';

export class TagRepository {
  async findAll(): Promise<Tag[]> {
    const result = await pool.query(
      'SELECT * FROM tags ORDER BY usage_count DESC, name ASC'
    );
    return result.rows.map((row) => toCamelCase<Tag>(row));
  }

  async findById(id: string): Promise<Tag | null> {
    const result = await pool.query('SELECT * FROM tags WHERE id = $1', [id]);
    return result.rows.length > 0 ? toCamelCase<Tag>(result.rows[0]) : null;
  }

  async findByName(name: string): Promise<Tag | null> {
    const result = await pool.query(
      'SELECT * FROM tags WHERE LOWER(name) = LOWER($1)',
      [name]
    );
    return result.rows.length > 0 ? toCamelCase<Tag>(result.rows[0]) : null;
  }

  async create(name: string, description?: string): Promise<Tag> {
    const result = await pool.query(
      'INSERT INTO tags (name, description) VALUES ($1, $2) RETURNING *',
      [name.toLowerCase(), description || null]
    );
    return toCamelCase<Tag>(result.rows[0]);
  }

  async getPopular(limit: number = 20): Promise<Tag[]> {
    const result = await pool.query(
      'SELECT * FROM tags ORDER BY usage_count DESC LIMIT $1',
      [limit]
    );
    return result.rows.map((row) => toCamelCase<Tag>(row));
  }

  async search(query: string, limit: number = 10): Promise<Tag[]> {
    const result = await pool.query(
      `SELECT * FROM tags 
       WHERE name ILIKE $1 
       ORDER BY usage_count DESC 
       LIMIT $2`,
      [`%${query}%`, limit]
    );
    return result.rows.map((row) => toCamelCase<Tag>(row));
  }
}

export class DepartmentRepository {
  async findAll(): Promise<Department[]> {
    const result = await pool.query(
      'SELECT * FROM departments ORDER BY name ASC'
    );
    return result.rows.map((row) => toCamelCase<Department>(row));
  }

  async findById(id: string): Promise<Department | null> {
    const result = await pool.query('SELECT * FROM departments WHERE id = $1', [id]);
    return result.rows.length > 0 ? toCamelCase<Department>(result.rows[0]) : null;
  }
}

export const tagRepository = new TagRepository();
export const departmentRepository = new DepartmentRepository();
