import { Router, Request, Response } from 'express';
import { voteService } from '../services/VoteService.js';
import { authHook } from '../middleware/authHook.js';
import { validateBody, validateUUIDParam } from '../middleware/validation.js';

const router = Router();

// POST /api/questions/:id/vote - Vote on question
router.post('/questions/:id/vote', authHook, validateUUIDParam('id'), validateBody(['voteType']), async (req: Request, res: Response) => {
  try {
    const { voteType } = req.body;

    if (!['upvote', 'downvote'].includes(voteType)) {
      res.status(400).json({ error: 'Invalid vote type', validTypes: ['upvote', 'downvote'] });
      return;
    }

    const result = await voteService.voteOnQuestion(req.auth!, req.params.id, voteType);
    res.json(result);
  } catch (error) {
    const err = error as Error;
    if (err.message === 'Question not found') {
      res.status(404).json({ error: err.message });
      return;
    }
    if (err.message.includes('Cannot vote on your own')) {
      res.status(403).json({ error: 'Forbidden', message: err.message });
      return;
    }
    res.status(500).json({ error: 'Failed to vote', message: err.message });
  }
});

// POST /api/answers/:id/vote - Vote on answer
router.post('/answers/:id/vote', authHook, validateUUIDParam('id'), validateBody(['voteType']), async (req: Request, res: Response) => {
  try {
    const { voteType } = req.body;

    if (!['upvote', 'downvote'].includes(voteType)) {
      res.status(400).json({ error: 'Invalid vote type', validTypes: ['upvote', 'downvote'] });
      return;
    }

    const result = await voteService.voteOnAnswer(req.auth!, req.params.id, voteType);
    res.json(result);
  } catch (error) {
    const err = error as Error;
    if (err.message === 'Answer not found') {
      res.status(404).json({ error: err.message });
      return;
    }
    if (err.message.includes('Cannot vote on your own')) {
      res.status(403).json({ error: 'Forbidden', message: err.message });
      return;
    }
    res.status(500).json({ error: 'Failed to vote', message: err.message });
  }
});

export default router;
