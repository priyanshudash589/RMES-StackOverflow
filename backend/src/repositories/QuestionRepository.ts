import { pool, toCamelCase } from '../config/database.js';
import {
  Question,
  CreateQuestionDTO,
  UpdateQuestionDTO,
  QuestionFilters,
  PaginationParams,
  Tag,
  SimilarQuestion,
} from '../types/index.js';

export class QuestionRepository {
  async findById(id: string): Promise<Question | null> {
    const result = await pool.query(
      `SELECT q.*, 
        u.display_name as author_name, u.avatar_url as author_avatar, u.reputation as author_reputation,
        d.name as department_name
       FROM questions q
       LEFT JOIN users u ON q.author_id = u.id
       LEFT JOIN departments d ON q.department_id = d.id
       WHERE q.id = $1 AND q.is_deleted = false`,
      [id]
    );

    if (result.rows.length === 0) return null;

    const question = toCamelCase<Question>(result.rows[0]);
    question.tags = await this.getQuestionTags(id);
    return question;
  }

  async findAll(
    filters: QuestionFilters = {},
    pagination: PaginationParams = {}
  ): Promise<{ questions: Question[]; total: number }> {
    const { page = 1, limit = 20 } = pagination;
    const offset = (page - 1) * limit;
    const params: (string | number)[] = [];
    let whereClause = 'WHERE q.is_deleted = false';

    if (filters.departmentId) {
      params.push(filters.departmentId);
      whereClause += ` AND q.department_id = $${params.length}`;
    }

    if (filters.status) {
      params.push(filters.status);
      whereClause += ` AND q.status = $${params.length}`;
    }

    if (filters.authorId) {
      params.push(filters.authorId);
      whereClause += ` AND q.author_id = $${params.length}`;
    }

    if (filters.tagId) {
      params.push(filters.tagId);
      whereClause += ` AND EXISTS (SELECT 1 FROM question_tags qt WHERE qt.question_id = q.id AND qt.tag_id = $${params.length})`;
    }

    if (filters.search) {
      params.push(filters.search);
      whereClause += ` AND q.search_vector @@ plainto_tsquery('english', $${params.length})`;
    }

    // Get total count
    const countResult = await pool.query(
      `SELECT COUNT(*) as total FROM questions q ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].total);

    // Get questions
    params.push(limit, offset);
    const query = `
      SELECT q.*, 
        u.display_name as author_name, u.avatar_url as author_avatar,
        d.name as department_name
      FROM questions q
      LEFT JOIN users u ON q.author_id = u.id
      LEFT JOIN departments d ON q.department_id = d.id
      ${whereClause}
      ORDER BY q.created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `;

    const result = await pool.query(query, params);
    const questions = await Promise.all(
      result.rows.map(async (row) => {
        const question = toCamelCase<Question>(row);
        question.tags = await this.getQuestionTags(question.id);
        return question;
      })
    );

    return { questions, total };
  }

  async create(authorId: string, data: CreateQuestionDTO): Promise<Question> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const result = await client.query(
        `INSERT INTO questions (title, body, author_id, department_id)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [data.title, data.body, authorId, data.departmentId || null]
      );

      const question = toCamelCase<Question>(result.rows[0]);

      // Add tags if provided
      if (data.tagIds && data.tagIds.length > 0) {
        for (const tagId of data.tagIds) {
          await client.query(
            'INSERT INTO question_tags (question_id, tag_id) VALUES ($1, $2)',
            [question.id, tagId]
          );
          // Increment tag usage count
          await client.query(
            'UPDATE tags SET usage_count = usage_count + 1 WHERE id = $1',
            [tagId]
          );
        }
      }

      await client.query('COMMIT');
      question.tags = await this.getQuestionTags(question.id);
      return question;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async update(id: string, data: UpdateQuestionDTO): Promise<Question | null> {
    const fields: string[] = [];
    const values: (string | undefined)[] = [];
    let paramCount = 1;

    if (data.title !== undefined) {
      fields.push(`title = $${paramCount++}`);
      values.push(data.title);
    }
    if (data.body !== undefined) {
      fields.push(`body = $${paramCount++}`);
      values.push(data.body);
    }
    if (data.departmentId !== undefined) {
      fields.push(`department_id = $${paramCount++}`);
      values.push(data.departmentId);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const result = await pool.query(
      `UPDATE questions SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramCount} AND is_deleted = false
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) return null;

    // Update tags if provided
    if (data.tagIds) {
      await pool.query('DELETE FROM question_tags WHERE question_id = $1', [id]);
      for (const tagId of data.tagIds) {
        await pool.query(
          'INSERT INTO question_tags (question_id, tag_id) VALUES ($1, $2)',
          [id, tagId]
        );
      }
    }

    return this.findById(id);
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await pool.query(
      `UPDATE questions SET is_deleted = true, deleted_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND is_deleted = false`,
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }

  async updateStatus(id: string, status: string): Promise<Question | null> {
    const result = await pool.query(
      `UPDATE questions SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND is_deleted = false
       RETURNING *`,
      [status, id]
    );
    if (result.rows.length === 0) return null;
    return this.findById(id);
  }

  async setAcceptedAnswer(questionId: string, answerId: string): Promise<void> {
    await pool.query(
      'UPDATE questions SET accepted_answer_id = $1, status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [answerId, 'solved', questionId]
    );
  }

  async incrementViewCount(id: string): Promise<void> {
    await pool.query(
      'UPDATE questions SET view_count = view_count + 1 WHERE id = $1',
      [id]
    );
  }

  async updateVoteScore(id: string, delta: number): Promise<void> {
    await pool.query(
      'UPDATE questions SET vote_score = vote_score + $1 WHERE id = $2',
      [delta, id]
    );
  }

  async updateAnswerCount(id: string, delta: number): Promise<void> {
    await pool.query(
      'UPDATE questions SET answer_count = answer_count + $1 WHERE id = $2',
      [delta, id]
    );
  }

  async getQuestionTags(questionId: string): Promise<Tag[]> {
    const result = await pool.query(
      `SELECT t.* FROM tags t
       INNER JOIN question_tags qt ON t.id = qt.tag_id
       WHERE qt.question_id = $1`,
      [questionId]
    );
    return result.rows.map((row) => toCamelCase<Tag>(row));
  }

  async findSimilar(searchText: string, limit: number = 5): Promise<SimilarQuestion[]> {
    const result = await pool.query(
      `SELECT id, title, 
        ts_rank(search_vector, plainto_tsquery('english', $1)) AS similarity
       FROM questions
       WHERE is_deleted = false 
         AND search_vector @@ plainto_tsquery('english', $1)
       ORDER BY similarity DESC
       LIMIT $2`,
      [searchText, limit]
    );
    return result.rows.map((row) => toCamelCase<SimilarQuestion>(row));
  }
}

export const questionRepository = new QuestionRepository();
