import { pool, toCamelCase } from '../config/database.js';
import { Vote, VoteType, VoteableType } from '../types/index.js';

export class VoteRepository {
  async findUserVoteOnQuestion(userId: string, questionId: string): Promise<Vote | null> {
    const result = await pool.query(
      'SELECT * FROM votes WHERE user_id = $1 AND question_id = $2',
      [userId, questionId]
    );
    return result.rows.length > 0 ? toCamelCase<Vote>(result.rows[0]) : null;
  }

  async findUserVoteOnAnswer(userId: string, answerId: string): Promise<Vote | null> {
    const result = await pool.query(
      'SELECT * FROM votes WHERE user_id = $1 AND answer_id = $2',
      [userId, answerId]
    );
    return result.rows.length > 0 ? toCamelCase<Vote>(result.rows[0]) : null;
  }

  async createQuestionVote(
    userId: string,
    questionId: string,
    voteType: VoteType
  ): Promise<Vote> {
    const result = await pool.query(
      `INSERT INTO votes (user_id, question_id, vote_type, voteable_type)
       VALUES ($1, $2, $3, 'question')
       RETURNING *`,
      [userId, questionId, voteType]
    );
    return toCamelCase<Vote>(result.rows[0]);
  }

  async createAnswerVote(
    userId: string,
    answerId: string,
    voteType: VoteType
  ): Promise<Vote> {
    const result = await pool.query(
      `INSERT INTO votes (user_id, answer_id, vote_type, voteable_type)
       VALUES ($1, $2, $3, 'answer')
       RETURNING *`,
      [userId, answerId, voteType]
    );
    return toCamelCase<Vote>(result.rows[0]);
  }

  async updateVote(id: string, voteType: VoteType): Promise<Vote | null> {
    const result = await pool.query(
      'UPDATE votes SET vote_type = $1 WHERE id = $2 RETURNING *',
      [voteType, id]
    );
    return result.rows.length > 0 ? toCamelCase<Vote>(result.rows[0]) : null;
  }

  async deleteVote(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM votes WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async getQuestionVoteCounts(questionId: string): Promise<{ upvotes: number; downvotes: number }> {
    const result = await pool.query(
      `SELECT 
        COUNT(*) FILTER (WHERE vote_type = 'upvote') as upvotes,
        COUNT(*) FILTER (WHERE vote_type = 'downvote') as downvotes
       FROM votes WHERE question_id = $1`,
      [questionId]
    );
    return {
      upvotes: parseInt(result.rows[0].upvotes) || 0,
      downvotes: parseInt(result.rows[0].downvotes) || 0,
    };
  }

  async getAnswerVoteCounts(answerId: string): Promise<{ upvotes: number; downvotes: number }> {
    const result = await pool.query(
      `SELECT 
        COUNT(*) FILTER (WHERE vote_type = 'upvote') as upvotes,
        COUNT(*) FILTER (WHERE vote_type = 'downvote') as downvotes
       FROM votes WHERE answer_id = $1`,
      [answerId]
    );
    return {
      upvotes: parseInt(result.rows[0].upvotes) || 0,
      downvotes: parseInt(result.rows[0].downvotes) || 0,
    };
  }
}

export const voteRepository = new VoteRepository();
