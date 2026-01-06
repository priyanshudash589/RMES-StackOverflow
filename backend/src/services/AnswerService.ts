import { answerRepository } from '../repositories/AnswerRepository.js';
import { questionRepository } from '../repositories/QuestionRepository.js';
import { reputationService } from './ReputationService.js';
import {
  Answer,
  CreateAnswerDTO,
  UpdateAnswerDTO,
  AuthContext,
} from '../types/index.js';

export class AnswerService {
  async getAnswersByQuestionId(questionId: string): Promise<Answer[]> {
    return answerRepository.findByQuestionId(questionId);
  }

  async getAnswerById(id: string): Promise<Answer | null> {
    return answerRepository.findById(id);
  }

  async createAnswer(
    auth: AuthContext,
    questionId: string,
    data: CreateAnswerDTO
  ): Promise<Answer> {
    // Verify question exists
    const question = await questionRepository.findById(questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    const answer = await answerRepository.create(questionId, auth.userId, data);

    // Update question answer count
    await questionRepository.updateAnswerCount(questionId, 1);

    // Award reputation for posting answer
    await reputationService.awardPoints(auth.userId, 'answer_posted', answer.id);

    return answer;
  }

  async updateAnswer(
    auth: AuthContext,
    answerId: string,
    data: UpdateAnswerDTO
  ): Promise<Answer | null> {
    const answer = await answerRepository.findById(answerId);
    if (!answer) return null;

    // Only author can edit their answer
    if (answer.authorId !== auth.userId) {
      throw new Error('Unauthorized: Only the author can edit this answer');
    }

    return answerRepository.update(answerId, data);
  }

  async deleteAnswer(auth: AuthContext, answerId: string): Promise<boolean> {
    const answer = await answerRepository.findById(answerId);
    if (!answer) return false;

    // Only author can delete their answer
    if (answer.authorId !== auth.userId) {
      throw new Error('Unauthorized: Only the author can delete this answer');
    }

    const deleted = await answerRepository.softDelete(answerId);
    if (deleted) {
      // Update question answer count
      await questionRepository.updateAnswerCount(answer.questionId, -1);
    }

    return deleted;
  }

  async acceptAnswer(auth: AuthContext, answerId: string): Promise<Answer | null> {
    const answer = await answerRepository.findById(answerId);
    if (!answer) return null;

    // Get the question to verify ownership
    const question = await questionRepository.findById(answer.questionId);
    if (!question) return null;

    // Only question author can accept an answer
    if (question.authorId !== auth.userId) {
      throw new Error('Unauthorized: Only the question author can accept an answer');
    }

    // Mark answer as accepted
    const acceptedAnswer = await answerRepository.markAccepted(answerId);
    if (acceptedAnswer) {
      // Update question with accepted answer
      await questionRepository.setAcceptedAnswer(answer.questionId, answerId);

      // Award reputation to answer author
      await reputationService.awardPoints(answer.authorId, 'answer_accepted', answerId);
    }

    return acceptedAnswer;
  }
}

export const answerService = new AnswerService();
