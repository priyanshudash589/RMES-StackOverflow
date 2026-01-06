import { Router, Request, Response } from 'express';
import { questionService } from '../services/QuestionService.js';
import { leaderboardService } from '../services/LeaderboardService.js';
import { departmentService } from '../services/TagService.js';

const router = Router();

// Helper function for time ago formatting
function formatTimeAgo(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMinutes > 0) return `${diffMinutes}m ago`;
  return 'just now';
}

// Question Feed Page
router.get('/questions', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const search = req.query.search as string;
    const departmentId = req.query.departmentId as string;
    const status = req.query.status as string;
    const sortBy = req.query.sort as string;

    // Get questions
    const result = await questionService.getQuestions(
      { search, departmentId, status: status as any },
      { page, limit: 20 }
    );

    // Get departments for filter
    const departments = await departmentService.getAllDepartments();

    // Get trending questions (top voted)
    const trendingResult = await questionService.getQuestions({}, { page: 1, limit: 4 });
    const trendingQuestions = trendingResult.data;

    // Get top contributors
    const topContributors = await leaderboardService.getOrganizationLeaderboard(3);

    res.render('questions-feed', {
      pageTitle: 'Question Feed',
      questions: result.data,
      pagination: result.pagination,
      departments,
      trendingQuestions,
      topContributors,
      search: search || '',
      sortBy: sortBy || 'newest',
      selectedDepartment: departmentId,
      formatTimeAgo,
    });
  } catch (error) {
    console.error('Error loading questions feed:', error);
    res.status(500).render('error', { message: 'Failed to load questions' });
  }
});

// Question Detail Page
router.get('/questions/:id', async (req: Request, res: Response) => {
  try {
    const questionId = req.params.id;
    
    // Get question with all details
    const question = await questionService.getQuestionById(questionId);
    
    if (!question) {
      return res.status(404).render('error', { message: 'Question not found' });
    }

    // Get related questions (view count incremented in getQuestionById)
    const relatedResult = await questionService.findSimilarQuestions(question.title);
    const relatedQuestions = relatedResult.filter((q: { id: string }) => q.id !== questionId).slice(0, 4);

    res.render('question-detail', {
      pageTitle: question.title,
      question,
      relatedQuestions,
      formatTimeAgo,
    });
  } catch (error) {
    console.error('Error loading question detail:', error);
    res.status(500).render('error', { message: 'Failed to load question' });
  }
});

// Ask Question Page
router.get('/questions/ask', async (req: Request, res: Response) => {
  try {
    // Get departments for dropdown
    const departments = await departmentService.getAllDepartments();

    res.render('ask-question', {
      pageTitle: 'Ask a Question',
      departments,
    });
  } catch (error) {
    console.error('Error loading ask question page:', error);
    res.status(500).render('error', { message: 'Failed to load page' });
  }
});

// Leaderboard Page
router.get('/leaderboard', async (req: Request, res: Response) => {
  try {
    const period = req.query.period as string || 'month';
    const view = req.query.view as string || 'org';
    const search = req.query.search as string;
    const departmentId = req.query.departmentId as string;

    let leaderboard;
    if (view === 'dept' && departmentId) {
      leaderboard = await leaderboardService.getDepartmentLeaderboard(departmentId, 20);
    } else {
      leaderboard = await leaderboardService.getOrganizationLeaderboard(20);
    }

    // Format reputation helper
    const formatReputation = (rep: number): string => {
      if (rep >= 1000) {
        return (rep / 1000).toFixed(1) + 'k';
      }
      return rep.toString();
    };

    res.render('leaderboard', {
      pageTitle: 'Leaderboard',
      leaderboard,
      period,
      view,
      search,
      formatReputation,
    });
  } catch (error) {
    console.error('Error loading leaderboard:', error);
    res.status(500).render('error', { message: 'Failed to load leaderboard' });
  }
});

// Home page redirect to questions
router.get('/', (req: Request, res: Response) => {
  res.redirect('/questions');
});

export default router;
