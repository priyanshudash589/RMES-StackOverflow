import { pool } from '../config/database.js';
import { userRepository } from '../repositories/UserRepository.js';
import { ReputationAction } from '../types/index.js';

// Points mapping for each action
const REPUTATION_POINTS: Record<ReputationAction, number> = {
  question_upvoted: 5,
  question_downvoted: -2,
  answer_upvoted: 10,
  answer_downvoted: -2,
  answer_accepted: 25,
  answer_posted: 10,
  documentation_approved: 15,
};

export class ReputationService {
  async awardPoints(
    userId: string,
    action: ReputationAction,
    referenceId?: string
  ): Promise<number> {
    const points = REPUTATION_POINTS[action];

    // Update user reputation
    await userRepository.updateReputation(userId, points);

    // Record history
    await pool.query(
      `INSERT INTO reputation_history (user_id, action, points, reference_id)
       VALUES ($1, $2, $3, $4)`,
      [userId, action, points, referenceId || null]
    );

    return points;
  }

  async getUserReputation(userId: string): Promise<number> {
    const user = await userRepository.findById(userId);
    return user?.reputation ?? 0;
  }

  async getReputationHistory(
    userId: string,
    limit: number = 50
  ): Promise<Array<{ action: ReputationAction; points: number; createdAt: Date }>> {
    const result = await pool.query(
      `SELECT action, points, created_at
       FROM reputation_history
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [userId, limit]
    );

    return result.rows.map((row) => ({
      action: row.action,
      points: row.points,
      createdAt: row.created_at,
    }));
  }

  async recalculateUserReputation(userId: string): Promise<number> {
    // Sum all reputation history for user
    const result = await pool.query(
      'SELECT COALESCE(SUM(points), 0) as total FROM reputation_history WHERE user_id = $1',
      [userId]
    );

    const total = parseInt(result.rows[0].total);

    // Update user reputation to match calculated total
    await pool.query(
      'UPDATE users SET reputation = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [total, userId]
    );

    return total;
  }
}

export const reputationService = new ReputationService();
