import { Router, Request, Response } from 'express';
import { tagService, departmentService } from '../services/TagService.js';
import { userRepository } from '../repositories/UserRepository.js';
import { reputationService } from '../services/ReputationService.js';
import { authHook, optionalAuth } from '../middleware/authHook.js';
import { validateUUIDParam } from '../middleware/validation.js';

const router = Router();

// GET /api/tags - Get all tags
router.get('/tags', async (req: Request, res: Response) => {
  try {
    const tags = await tagService.getAllTags();
    res.json({ data: tags });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tags', message: (error as Error).message });
  }
});

// GET /api/tags/popular - Get popular tags
router.get('/tags/popular', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const tags = await tagService.getPopularTags(limit);
    res.json({ data: tags });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tags', message: (error as Error).message });
  }
});

// GET /api/tags/search - Search tags
router.get('/tags/search', async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      res.status(400).json({ error: 'Missing required query parameter: q' });
      return;
    }
    const tags = await tagService.searchTags(query);
    res.json({ data: tags });
  } catch (error) {
    res.status(500).json({ error: 'Failed to search tags', message: (error as Error).message });
  }
});

// GET /api/departments - Get all departments
router.get('/departments', async (req: Request, res: Response) => {
  try {
    const departments = await departmentService.getAllDepartments();
    res.json({ data: departments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch departments', message: (error as Error).message });
  }
});

// GET /api/users/:id - Get user profile
router.get('/users/:id', validateUUIDParam('id'), async (req: Request, res: Response) => {
  try {
    const user = await userRepository.findById(req.params.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user', message: (error as Error).message });
  }
});

// GET /api/users/:id/reputation-history - Get user reputation history
router.get('/users/:id/reputation-history', validateUUIDParam('id'), async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const history = await reputationService.getReputationHistory(req.params.id, limit);
    res.json({ data: history });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reputation history', message: (error as Error).message });
  }
});

// GET /api/me - Get current user (requires auth)
router.get('/me', authHook, async (req: Request, res: Response) => {
  try {
    const user = await userRepository.findById(req.auth!.userId);
    if (!user) {
      // Create user if doesn't exist (for dev mode)
      const newUser = await userRepository.create({
        email: req.auth!.email,
        displayName: req.auth!.displayName,
        departmentId: req.auth!.departmentId,
      });
      res.json(newUser);
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user', message: (error as Error).message });
  }
});

export default router;
