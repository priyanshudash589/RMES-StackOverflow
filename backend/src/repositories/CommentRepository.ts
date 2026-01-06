import { pool, toCamelCase } from '../config/database.js';
import { Comment, CreateCommentDTO, UpdateCommentDTO } from '../types/index.js';

export class CommentRepository {
  async findById(id: string): Promise<Comment | null> {
    const result = await pool.query(
      `SELECT c.*, 
        u.display_name as author_name, u.avatar_url as author_avatar
       FROM comments c
       LEFT JOIN users u ON c.author_id = u.id
       WHERE c.id = $1 AND c.is_deleted = false`,
      [id]
    );
    return result.rows.length > 0 ? toCamelCase<Comment>(result.rows[0]) : null;
  }

  async findByQuestionId(questionId: string): Promise<Comment[]> {
    const result = await pool.query(
      `SELECT c.*, 
        u.display_name as author_name, u.avatar_url as author_avatar
       FROM comments c
       LEFT JOIN users u ON c.author_id = u.id
       WHERE c.question_id = $1 AND c.is_deleted = false
       ORDER BY c.created_at ASC`,
      [questionId]
    );
    return this.buildCommentTree(result.rows.map((row) => toCamelCase<Comment>(row)));
  }

  async findByAnswerId(answerId: string): Promise<Comment[]> {
    const result = await pool.query(
      `SELECT c.*, 
        u.display_name as author_name, u.avatar_url as author_avatar
       FROM comments c
       LEFT JOIN users u ON c.author_id = u.id
       WHERE c.answer_id = $1 AND c.is_deleted = false
       ORDER BY c.created_at ASC`,
      [answerId]
    );
    return this.buildCommentTree(result.rows.map((row) => toCamelCase<Comment>(row)));
  }

  async createForQuestion(
    questionId: string,
    authorId: string,
    data: CreateCommentDTO
  ): Promise<Comment> {
    const result = await pool.query(
      `INSERT INTO comments (question_id, author_id, body, parent_comment_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [questionId, authorId, data.body, data.parentCommentId || null]
    );
    return toCamelCase<Comment>(result.rows[0]);
  }

  async createForAnswer(
    answerId: string,
    authorId: string,
    data: CreateCommentDTO
  ): Promise<Comment> {
    const result = await pool.query(
      `INSERT INTO comments (answer_id, author_id, body, parent_comment_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [answerId, authorId, data.body, data.parentCommentId || null]
    );
    return toCamelCase<Comment>(result.rows[0]);
  }

  async update(id: string, data: UpdateCommentDTO): Promise<Comment | null> {
    const result = await pool.query(
      `UPDATE comments SET body = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND is_deleted = false
       RETURNING *`,
      [data.body, id]
    );
    return result.rows.length > 0 ? toCamelCase<Comment>(result.rows[0]) : null;
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await pool.query(
      `UPDATE comments SET is_deleted = true, deleted_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND is_deleted = false`,
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }

  async getAuthorId(id: string): Promise<string | null> {
    const result = await pool.query(
      'SELECT author_id FROM comments WHERE id = $1',
      [id]
    );
    return result.rows.length > 0 ? result.rows[0].author_id : null;
  }

  // Build nested comment tree from flat list
  private buildCommentTree(comments: Comment[]): Comment[] {
    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    // First pass: create a map of all comments
    comments.forEach((comment) => {
      comment.replies = [];
      commentMap.set(comment.id, comment);
    });

    // Second pass: build the tree
    comments.forEach((comment) => {
      if (comment.parentCommentId) {
        const parent = commentMap.get(comment.parentCommentId);
        if (parent && parent.replies) {
          parent.replies.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });

    return rootComments;
  }
}

export const commentRepository = new CommentRepository();
