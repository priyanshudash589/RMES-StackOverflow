import { Router, Request, Response } from 'express';
import { commentService } from '../services/CommentService.js';
import { authHook } from '../middleware/authHook.js';
import { validateBody, validateUUIDParam } from '../middleware/validation.js';

const router = Router();

// PUT /api/comments/:id - Update comment
router.put('/:id', authHook, validateUUIDParam('id'), validateBody(['body']), async (req: Request, res: Response) => {
  try {
    const comment = await commentService.updateComment(req.auth!, req.params.id, {
      body: req.body.body,
    });

    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    res.json(comment);
  } catch (error) {
    const err = error as Error;
    if (err.message.startsWith('Unauthorized:')) {
      res.status(403).json({ error: 'Forbidden', message: err.message });
      return;
    }
    res.status(500).json({ error: 'Failed to update comment', message: err.message });
  }
});

// DELETE /api/comments/:id - Delete comment
router.delete('/:id', authHook, validateUUIDParam('id'), async (req: Request, res: Response) => {
  try {
    const deleted = await commentService.deleteComment(req.auth!, req.params.id);

    if (!deleted) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    const err = error as Error;
    if (err.message.startsWith('Unauthorized:')) {
      res.status(403).json({ error: 'Forbidden', message: err.message });
      return;
    }
    res.status(500).json({ error: 'Failed to delete comment', message: err.message });
  }
});

export default router;
