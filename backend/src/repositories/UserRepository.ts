import { pool, toCamelCase } from '../config/database.js';
import { User } from '../types/index.js';

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    const result = await pool.query(
      `SELECT u.*, d.name as department_name 
       FROM users u 
       LEFT JOIN departments d ON u.department_id = d.id 
       WHERE u.id = $1 AND u.is_active = true`,
      [id]
    );
    return result.rows.length > 0 ? toCamelCase<User>(result.rows[0]) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );
    return result.rows.length > 0 ? toCamelCase<User>(result.rows[0]) : null;
  }

  async create(data: {
    email: string;
    displayName: string;
    avatarUrl?: string;
    departmentId?: string;
  }): Promise<User> {
    const result = await pool.query(
      `INSERT INTO users (email, display_name, avatar_url, department_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.email, data.displayName, data.avatarUrl || null, data.departmentId || null]
    );
    return toCamelCase<User>(result.rows[0]);
  }

  async updateReputation(userId: string, points: number): Promise<void> {
    await pool.query(
      'UPDATE users SET reputation = reputation + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [points, userId]
    );
  }

  async getLeaderboard(limit: number = 10, departmentId?: string): Promise<User[]> {
    let query = `
      SELECT u.*, 
        (SELECT COUNT(*) FROM answers a WHERE a.author_id = u.id AND a.is_deleted = false) as answers_count,
        (SELECT COUNT(*) FROM answers a WHERE a.author_id = u.id AND a.is_accepted = true) as accepted_answers_count
      FROM users u
      WHERE u.is_active = true
    `;
    const params: (string | number)[] = [];

    if (departmentId) {
      params.push(departmentId);
      query += ` AND u.department_id = $${params.length}`;
    }

    params.push(limit);
    query += ` ORDER BY u.reputation DESC LIMIT $${params.length}`;

    const result = await pool.query(query, params);
    return result.rows.map((row) => toCamelCase<User>(row));
  }
}

export const userRepository = new UserRepository();
