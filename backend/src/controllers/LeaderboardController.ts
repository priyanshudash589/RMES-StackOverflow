import { Router, Request, Response } from 'express';
import { leaderboardService } from '../services/LeaderboardService.js';
import { validateUUIDParam } from '../middleware/validation.js';

const router = Router();

// GET /api/leaderboard - Organization-wide leaderboard
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const leaderboard = await leaderboardService.getOrganizationLeaderboard(limit);
    res.json({ data: leaderboard });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard', message: (error as Error).message });
  }
});

// GET /api/leaderboard/:departmentId - Department-specific leaderboard
router.get('/:departmentId', validateUUIDParam('departmentId'), async (req: Request, res: Response) => {
  try {
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const leaderboard = await leaderboardService.getDepartmentLeaderboard(req.params.departmentId, limit);
    res.json({ data: leaderboard });
  } catch (error) {
    const err = error as Error;
    if (err.message === 'Department not found') {
      res.status(404).json({ error: err.message });
      return;
    }
    res.status(500).json({ error: 'Failed to fetch leaderboard', message: err.message });
  }
});

export default router;
