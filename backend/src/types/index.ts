// =====================================================
// Core TypeScript Types and Interfaces
// =====================================================

// Enums matching PostgreSQL types
export type QuestionStatus = 'open' | 'in_review' | 'solved' | 'documented';
export type VoteType = 'upvote' | 'downvote';
export type VoteableType = 'question' | 'answer';
export type ReputationAction = 
  | 'question_upvoted'
  | 'question_downvoted'
  | 'answer_upvoted'
  | 'answer_downvoted'
  | 'answer_accepted'
  | 'answer_posted'
  | 'documentation_approved';

// Base entity with common fields
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Department
export interface Department extends BaseEntity {
  name: string;
  description: string | null;
}

// User
export interface User extends BaseEntity {
  email: string;
  displayName: string;
  avatarUrl: string | null;
  departmentId: string | null;
  department?: Department;
  reputation: number;
  isActive: boolean;
}

// Tag
export interface Tag {
  id: string;
  name: string;
  description: string | null;
  usageCount: number;
  createdAt: Date;
}

// Question
export interface Question extends BaseEntity {
  title: string;
  body: string;
  authorId: string;
  author?: User;
  departmentId: string | null;
  department?: Department;
  status: QuestionStatus;
  acceptedAnswerId: string | null;
  acceptedAnswer?: Answer;
  viewCount: number;
  voteScore: number;
  answerCount: number;
  isDeleted: boolean;
  deletedAt: Date | null;
  tags?: Tag[];
  answers?: Answer[];
  comments?: Comment[];
}

// Answer
export interface Answer extends BaseEntity {
  questionId: string;
  question?: Question;
  authorId: string;
  author?: User;
  body: string;
  voteScore: number;
  isAccepted: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  comments?: Comment[];
}

// Comment
export interface Comment extends BaseEntity {
  body: string;
  authorId: string;
  author?: User;
  questionId: string | null;
  answerId: string | null;
  parentCommentId: string | null;
  isDeleted: boolean;
  deletedAt: Date | null;
  replies?: Comment[];
}

// Vote
export interface Vote {
  id: string;
  userId: string;
  voteType: VoteType;
  voteableType: VoteableType;
  questionId: string | null;
  answerId: string | null;
  createdAt: Date;
}

// Reputation History
export interface ReputationHistory {
  id: string;
  userId: string;
  action: ReputationAction;
  points: number;
  referenceId: string | null;
  createdAt: Date;
}

// =====================================================
// API Request/Response Types
// =====================================================

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Question DTOs
export interface CreateQuestionDTO {
  title: string;
  body: string;
  departmentId?: string;
  tagIds?: string[];
}

export interface UpdateQuestionDTO {
  title?: string;
  body?: string;
  departmentId?: string;
  tagIds?: string[];
}

export interface QuestionFilters {
  departmentId?: string;
  status?: QuestionStatus;
  tagId?: string;
  authorId?: string;
  search?: string;
}

// Answer DTOs
export interface CreateAnswerDTO {
  body: string;
}

export interface UpdateAnswerDTO {
  body: string;
}

// Comment DTOs
export interface CreateCommentDTO {
  body: string;
  parentCommentId?: string;
}

export interface UpdateCommentDTO {
  body: string;
}

// Vote DTO
export interface VoteDTO {
  voteType: VoteType;
}

// Leaderboard Entry
export interface LeaderboardEntry {
  rank: number;
  user: User;
  reputation: number;
  answersCount: number;
  acceptedAnswersCount: number;
}

// Similar Question Result
export interface SimilarQuestion {
  id: string;
  title: string;
  similarity: number;
}

// Auth Context (stub for enterprise integration)
export interface AuthContext {
  userId: string;
  email: string;
  displayName: string;
  departmentId?: string;
}
