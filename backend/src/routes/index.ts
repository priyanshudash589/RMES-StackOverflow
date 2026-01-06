import { Router } from 'express';
import questionController from '../controllers/QuestionController.js';
import answerController from '../controllers/AnswerController.js';
import commentController from '../controllers/CommentController.js';
import voteController from '../controllers/VoteController.js';
import leaderboardController from '../controllers/LeaderboardController.js';
import miscController from '../controllers/MiscController.js';

const router = Router();

// Question routes
router.use('/questions', questionController);

// Answer routes - includes nested route for creating answers
router.use('/answers', answerController);
router.use('/', answerController); // For POST /questions/:questionId/answers

// Comment routes
router.use('/comments', commentController);

// Vote routes
router.use('/', voteController);

// Leaderboard routes
router.use('/leaderboard', leaderboardController);

// Misc routes (tags, departments, users)
router.use('/', miscController);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
