import { Router, Request, Response } from 'express';
import { answerService } from '../services/AnswerService.js';
import { commentService } from '../services/CommentService.js';
import { authHook } from '../middleware/authHook.js';
import { validateBody, validateUUIDParam } from '../middleware/validation.js';

const router = Router();

// POST /api/questions/:questionId/answers - Create answer for question
router.post('/questions/:questionId/answers', authHook, validateUUIDParam('questionId'), validateBody(['body']), async (req: Request, res: Response) => {
  try {
    const answer = await answerService.createAnswer(req.auth!, req.params.questionId, {
      body: req.body.body,
    });
    res.status(201).json(answer);
  } catch (error) {
    const err = error as Error;
    if (err.message === 'Question not found') {
      res.status(404).json({ error: err.message });
      return;
    }
    res.status(500).json({ error: 'Failed to create answer', message: err.message });
  }
});

// PUT /api/answers/:id - Update answer
router.put('/:id', authHook, validateUUIDParam('id'), validateBody(['body']), async (req: Request, res: Response) => {
  try {
    const answer = await answerService.updateAnswer(req.auth!, req.params.id, {
      body: req.body.body,
    });

    if (!answer) {
      res.status(404).json({ error: 'Answer not found' });
      return;
    }

    res.json(answer);
  } catch (error) {
    const err = error as Error;
    if (err.message.startsWith('Unauthorized:')) {
      res.status(403).json({ error: 'Forbidden', message: err.message });
      return;
    }
    res.status(500).json({ error: 'Failed to update answer', message: err.message });
  }
});

// DELETE /api/answers/:id - Delete answer
router.delete('/:id', authHook, validateUUIDParam('id'), async (req: Request, res: Response) => {
  try {
    const deleted = await answerService.deleteAnswer(req.auth!, req.params.id);

    if (!deleted) {
      res.status(404).json({ error: 'Answer not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    const err = error as Error;
    if (err.message.startsWith('Unauthorized:')) {
      res.status(403).json({ error: 'Forbidden', message: err.message });
      return;
    }
    res.status(500).json({ error: 'Failed to delete answer', message: err.message });
  }
});

// POST /api/answers/:id/accept - Mark answer as accepted
router.post('/:id/accept', authHook, validateUUIDParam('id'), async (req: Request, res: Response) => {
  try {
    const answer = await answerService.acceptAnswer(req.auth!, req.params.id);

    if (!answer) {
      res.status(404).json({ error: 'Answer not found' });
      return;
    }

    res.json(answer);
  } catch (error) {
    const err = error as Error;
    if (err.message.startsWith('Unauthorized:')) {
      res.status(403).json({ error: 'Forbidden', message: err.message });
      return;
    }
    res.status(500).json({ error: 'Failed to accept answer', message: err.message });
  }
});

// POST /api/answers/:id/comments - Add comment to answer
router.post('/:id/comments', authHook, validateUUIDParam('id'), validateBody(['body']), async (req: Request, res: Response) => {
  try {
    const comment = await commentService.createAnswerComment(req.auth!, req.params.id, {
      body: req.body.body,
      parentCommentId: req.body.parentCommentId,
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create comment', message: (error as Error).message });
  }
});

export default router;
