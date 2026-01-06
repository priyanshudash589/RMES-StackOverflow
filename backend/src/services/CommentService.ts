import { commentRepository } from '../repositories/CommentRepository.js';
import {
  Comment,
  CreateCommentDTO,
  UpdateCommentDTO,
  AuthContext,
} from '../types/index.js';

export class CommentService {
  async getCommentsByQuestionId(questionId: string): Promise<Comment[]> {
    return commentRepository.findByQuestionId(questionId);
  }

  async getCommentsByAnswerId(answerId: string): Promise<Comment[]> {
    return commentRepository.findByAnswerId(answerId);
  }

  async createQuestionComment(
    auth: AuthContext,
    questionId: string,
    data: CreateCommentDTO
  ): Promise<Comment> {
    return commentRepository.createForQuestion(questionId, auth.userId, data);
  }

  async createAnswerComment(
    auth: AuthContext,
    answerId: string,
    data: CreateCommentDTO
  ): Promise<Comment> {
    return commentRepository.createForAnswer(answerId, auth.userId, data);
  }

  async updateComment(
    auth: AuthContext,
    commentId: string,
    data: UpdateCommentDTO
  ): Promise<Comment | null> {
    const authorId = await commentRepository.getAuthorId(commentId);
    if (!authorId) return null;

    // Only author can edit their comment
    if (authorId !== auth.userId) {
      throw new Error('Unauthorized: Only the author can edit this comment');
    }

    return commentRepository.update(commentId, data);
  }

  async deleteComment(auth: AuthContext, commentId: string): Promise<boolean> {
    const authorId = await commentRepository.getAuthorId(commentId);
    if (!authorId) return false;

    // Only author can delete their comment
    if (authorId !== auth.userId) {
      throw new Error('Unauthorized: Only the author can delete this comment');
    }

    return commentRepository.softDelete(commentId);
  }
}

export const commentService = new CommentService();
