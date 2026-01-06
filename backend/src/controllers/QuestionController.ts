import { Router, Request, Response } from 'express';
import { questionService } from '../services/QuestionService.js';
import { answerService } from '../services/AnswerService.js';
import { commentService } from '../services/CommentService.js';
import { authHook, optionalAuth } from '../middleware/authHook.js';
import { validateBody, validateUUIDParam, parsePagination } from '../middleware/validation.js';
import { QuestionFilters, QuestionStatus } from '../types/index.js';

const router = Router();

// GET /api/questions - List questions with filters
router.get('/', optionalAuth, async (req: Request, res: Response) => {
  try {
    const pagination = parsePagination(req);
    const filters: QuestionFilters = {
      departmentId: req.query.departmentId as string,
      status: req.query.status as QuestionStatus,
      tagId: req.query.tagId as string,
      authorId: req.query.authorId as string,
      search: req.query.search as string,
    };

    const result = await questionService.getQuestions(filters, pagination);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions', message: (error as Error).message });
  }
});

// GET /api/questions/similar - Find similar questions
router.get('/similar', async (req: Request, res: Response) => {
  try {
    const searchText = req.query.q as string;
    if (!searchText) {
      res.status(400).json({ error: 'Missing required query parameter: q' });
      return;
    }

    const similar = await questionService.findSimilarQuestions(searchText);
    res.json({ data: similar });
  } catch (error) {
    res.status(500).json({ error: 'Failed to find similar questions', message: (error as Error).message });
  }
});

// GET /api/questions/:id - Get question by ID
router.get('/:id', validateUUIDParam('id'), optionalAuth, async (req: Request, res: Response) => {
  try {
    const question = await questionService.getQuestionById(req.params.id);
    if (!question) {
      res.status(404).json({ error: 'Question not found' });
      return;
    }

    // Also fetch answers and comments
    const answers = await answerService.getAnswersByQuestionId(req.params.id);
    const comments = await commentService.getCommentsByQuestionId(req.params.id);

    // Fetch comments for each answer
    for (const answer of answers) {
      answer.comments = await commentService.getCommentsByAnswerId(answer.id);
    }

    res.json({
      ...question,
      answers,
      comments,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch question', message: (error as Error).message });
  }
});

// POST /api/questions - Create question
router.post('/', authHook, validateBody(['title', 'body']), async (req: Request, res: Response) => {
  try {
    const question = await questionService.createQuestion(req.auth!, {
      title: req.body.title,
      body: req.body.body,
      departmentId: req.body.departmentId,
      tagIds: req.body.tagIds,
    });
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create question', message: (error as Error).message });
  }
});

// PUT /api/questions/:id - Update question
router.put('/:id', authHook, validateUUIDParam('id'), async (req: Request, res: Response) => {
  try {
    const question = await questionService.updateQuestion(req.auth!, req.params.id, {
      title: req.body.title,
      body: req.body.body,
      departmentId: req.body.departmentId,
      tagIds: req.body.tagIds,
    });

    if (!question) {
      res.status(404).json({ error: 'Question not found' });
      return;
    }

    res.json(question);
  } catch (error) {
    const err = error as Error;
    if (err.message.startsWith('Unauthorized:')) {
      res.status(403).json({ error: 'Forbidden', message: err.message });
      return;
    }
    res.status(500).json({ error: 'Failed to update question', message: err.message });
  }
});

// DELETE /api/questions/:id - Soft delete question
router.delete('/:id', authHook, validateUUIDParam('id'), async (req: Request, res: Response) => {
  try {
    const deleted = await questionService.deleteQuestion(req.auth!, req.params.id);

    if (!deleted) {
      res.status(404).json({ error: 'Question not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    const err = error as Error;
    if (err.message.startsWith('Unauthorized:')) {
      res.status(403).json({ error: 'Forbidden', message: err.message });
      return;
    }
    res.status(500).json({ error: 'Failed to delete question', message: err.message });
  }
});

// PATCH /api/questions/:id/status - Update question status
router.patch('/:id/status', authHook, validateUUIDParam('id'), validateBody(['status']), async (req: Request, res: Response) => {
  try {
    const validStatuses = ['open', 'in_review', 'solved', 'documented'];
    if (!validStatuses.includes(req.body.status)) {
      res.status(400).json({ error: 'Invalid status', validStatuses });
      return;
    }

    const question = await questionService.updateQuestionStatus(req.auth!, req.params.id, req.body.status);

    if (!question) {
      res.status(404).json({ error: 'Question not found' });
      return;
    }

    res.json(question);
  } catch (error) {
    const err = error as Error;
    if (err.message.startsWith('Unauthorized:')) {
      res.status(403).json({ error: 'Forbidden', message: err.message });
      return;
    }
    res.status(500).json({ error: 'Failed to update status', message: err.message });
  }
});

// POST /api/questions/:id/comments - Add comment to question
router.post('/:id/comments', authHook, validateUUIDParam('id'), validateBody(['body']), async (req: Request, res: Response) => {
  try {
    const comment = await commentService.createQuestionComment(req.auth!, req.params.id, {
      body: req.body.body,
      parentCommentId: req.body.parentCommentId,
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create comment', message: (error as Error).message });
  }
});

export default router;
