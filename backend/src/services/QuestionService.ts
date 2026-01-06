// import { questionRepository } from '../repositories/QuestionRepository.js';
// import { userRepository } from '../repositories/UserRepository.js';
// import { reputationService } from './ReputationService.js';
import {
  mockQuestions,
  getQuestionWithDetails,
  getSimilarQuestions,
} from '../data/mockData.js';
import {
  Question,
  CreateQuestionDTO,
  UpdateQuestionDTO,
  QuestionFilters,
  PaginationParams,
  PaginatedResponse,
  SimilarQuestion,
  AuthContext,
} from '../types/index.js';

export class QuestionService {
  async getQuestions(
    filters: QuestionFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Question>> {
    const { page = 1, limit = 20 } = pagination;
    
    // Filter mock questions
    let questions = [...mockQuestions];
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      questions = questions.filter(q => 
        q.title.toLowerCase().includes(searchLower) ||
        q.body.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.departmentId) {
      questions = questions.filter(q => q.departmentId === filters.departmentId);
    }
    
    if (filters.status) {
      questions = questions.filter(q => q.status === filters.status);
    }
    
    if (filters.authorId) {
      questions = questions.filter(q => q.authorId === filters.authorId);
    }
    
    // Sort by newest first
    questions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    // Paginate
    const total = questions.length;
    const start = (page - 1) * limit;
    const paginatedQuestions = questions.slice(start, start + limit);

    return {
      data: paginatedQuestions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getQuestionById(id: string, incrementViews: boolean = true): Promise<Question | null> {
    const question = getQuestionWithDetails(id);
    // In mock mode, we don't actually increment views
    return question;
  }

  async createQuestion(auth: AuthContext, data: CreateQuestionDTO): Promise<Question> {
    // Mock implementation - just return a new question
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      title: data.title,
      body: data.body,
      authorId: auth.userId,
      departmentId: data.departmentId || auth.departmentId || null,
      status: 'open',
      acceptedAnswerId: null,
      viewCount: 0,
      voteScore: 0,
      answerCount: 0,
      isDeleted: false,
      deletedAt: null,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return newQuestion;
  }

  async updateQuestion(
    auth: AuthContext,
    questionId: string,
    data: UpdateQuestionDTO
  ): Promise<Question | null> {
    const question = mockQuestions.find(q => q.id === questionId);
    if (!question) return null;

    if (question.authorId !== auth.userId) {
      throw new Error('Unauthorized: Only the author can edit this question');
    }

    return { ...question, ...data, updatedAt: new Date() };
  }

  async deleteQuestion(auth: AuthContext, questionId: string): Promise<boolean> {
    const question = mockQuestions.find(q => q.id === questionId);
    if (!question) return false;

    if (question.authorId !== auth.userId) {
      throw new Error('Unauthorized: Only the author can delete this question');
    }

    return true;
  }

  async updateQuestionStatus(
    auth: AuthContext,
    questionId: string,
    status: string
  ): Promise<Question | null> {
    const question = mockQuestions.find(q => q.id === questionId);
    if (!question) return null;

    if (question.authorId !== auth.userId) {
      throw new Error('Unauthorized: Only the author can change question status');
    }

    return { ...question, status: status as any, updatedAt: new Date() };
  }

  async findSimilarQuestions(searchText: string): Promise<SimilarQuestion[]> {
    return getSimilarQuestions(searchText);
  }
}

export const questionService = new QuestionService();
