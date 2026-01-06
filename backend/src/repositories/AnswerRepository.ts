import { pool, toCamelCase } from '../config/database.js';
import { Answer, CreateAnswerDTO, UpdateAnswerDTO } from '../types/index.js';

export class AnswerRepository {
  async findById(id: string): Promise<Answer | null> {
    const result = await pool.query(
      `SELECT a.*, 
        u.display_name as author_name, u.avatar_url as author_avatar, u.reputation as author_reputation
       FROM answers a
       LEFT JOIN users u ON a.author_id = u.id
       WHERE a.id = $1 AND a.is_deleted = false`,
      [id]
    );
    return result.rows.length > 0 ? toCamelCase<Answer>(result.rows[0]) : null;
  }

  async findByQuestionId(questionId: string): Promise<Answer[]> {
    const result = await pool.query(
      `SELECT a.*, 
        u.display_name as author_name, u.avatar_url as author_avatar, u.reputation as author_reputation
       FROM answers a
       LEFT JOIN users u ON a.author_id = u.id
       WHERE a.question_id = $1 AND a.is_deleted = false
       ORDER BY a.is_accepted DESC, a.vote_score DESC, a.created_at ASC`,
      [questionId]
    );
    return result.rows.map((row) => toCamelCase<Answer>(row));
  }

  async create(
    questionId: string,
    authorId: string,
    data: CreateAnswerDTO
  ): Promise<Answer> {
    const result = await pool.query(
      `INSERT INTO answers (question_id, author_id, body)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [questionId, authorId, data.body]
    );
    return toCamelCase<Answer>(result.rows[0]);
  }

  async update(id: string, data: UpdateAnswerDTO): Promise<Answer | null> {
    const result = await pool.query(
      `UPDATE answers SET body = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND is_deleted = false
       RETURNING *`,
      [data.body, id]
    );
    return result.rows.length > 0 ? toCamelCase<Answer>(result.rows[0]) : null;
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await pool.query(
      `UPDATE answers SET is_deleted = true, deleted_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND is_deleted = false`,
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }

  async markAccepted(id: string): Promise<Answer | null> {
    // First, unmark any previously accepted answer for this question
    const answer = await this.findById(id);
    if (!answer) return null;

    await pool.query(
      'UPDATE answers SET is_accepted = false WHERE question_id = $1',
      [answer.questionId]
    );

    // Mark this answer as accepted
    const result = await pool.query(
      `UPDATE answers SET is_accepted = true, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    return result.rows.length > 0 ? toCamelCase<Answer>(result.rows[0]) : null;
  }

  async updateVoteScore(id: string, delta: number): Promise<void> {
    await pool.query(
      'UPDATE answers SET vote_score = vote_score + $1 WHERE id = $2',
      [delta, id]
    );
  }

  async getAuthorId(id: string): Promise<string | null> {
    const result = await pool.query(
      'SELECT author_id FROM answers WHERE id = $1',
      [id]
    );
    return result.rows.length > 0 ? result.rows[0].author_id : null;
  }
}

export const answerRepository = new AnswerRepository();
