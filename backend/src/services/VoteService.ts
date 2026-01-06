import { voteRepository } from '../repositories/VoteRepository.js';
import { questionRepository } from '../repositories/QuestionRepository.js';
import { answerRepository } from '../repositories/AnswerRepository.js';
import { reputationService } from './ReputationService.js';
import { Vote, VoteType, AuthContext } from '../types/index.js';

export class VoteService {
  async voteOnQuestion(
    auth: AuthContext,
    questionId: string,
    voteType: VoteType
  ): Promise<{ vote: Vote; newScore: number }> {
    // Check if user already voted on this question
    const existingVote = await voteRepository.findUserVoteOnQuestion(auth.userId, questionId);
    
    // Get question for author info and current score
    const question = await questionRepository.findById(questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    // Cannot vote on own question
    if (question.authorId === auth.userId) {
      throw new Error('Cannot vote on your own question');
    }

    let vote: Vote;
    let scoreDelta = 0;

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // Same vote type - remove the vote
        await voteRepository.deleteVote(existingVote.id);
        scoreDelta = voteType === 'upvote' ? -1 : 1;
        
        // Reverse reputation
        if (voteType === 'upvote') {
          await reputationService.awardPoints(question.authorId, 'question_downvoted', questionId);
        } else {
          await reputationService.awardPoints(question.authorId, 'question_upvoted', questionId);
        }

        vote = existingVote; // Return the removed vote for reference
      } else {
        // Different vote type - change the vote
        const updatedVote = await voteRepository.updateVote(existingVote.id, voteType);
        vote = updatedVote!;
        scoreDelta = voteType === 'upvote' ? 2 : -2; // +2 or -2 for switching

        // Adjust reputation (reverse old + apply new)
        const oldAction = existingVote.voteType === 'upvote' ? 'question_downvoted' : 'question_upvoted';
        const newAction = voteType === 'upvote' ? 'question_upvoted' : 'question_downvoted';
        await reputationService.awardPoints(question.authorId, oldAction, questionId);
        await reputationService.awardPoints(question.authorId, newAction, questionId);
      }
    } else {
      // New vote
      vote = await voteRepository.createQuestionVote(auth.userId, questionId, voteType);
      scoreDelta = voteType === 'upvote' ? 1 : -1;

      // Award reputation
      const action = voteType === 'upvote' ? 'question_upvoted' : 'question_downvoted';
      await reputationService.awardPoints(question.authorId, action, questionId);
    }

    // Update question vote score
    await questionRepository.updateVoteScore(questionId, scoreDelta);

    return {
      vote,
      newScore: question.voteScore + scoreDelta,
    };
  }

  async voteOnAnswer(
    auth: AuthContext,
    answerId: string,
    voteType: VoteType
  ): Promise<{ vote: Vote; newScore: number }> {
    // Check if user already voted on this answer
    const existingVote = await voteRepository.findUserVoteOnAnswer(auth.userId, answerId);

    // Get answer for author info and current score
    const answer = await answerRepository.findById(answerId);
    if (!answer) {
      throw new Error('Answer not found');
    }

    // Cannot vote on own answer
    if (answer.authorId === auth.userId) {
      throw new Error('Cannot vote on your own answer');
    }

    let vote: Vote;
    let scoreDelta = 0;

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // Same vote type - remove the vote
        await voteRepository.deleteVote(existingVote.id);
        scoreDelta = voteType === 'upvote' ? -1 : 1;

        // Reverse reputation
        if (voteType === 'upvote') {
          await reputationService.awardPoints(answer.authorId, 'answer_downvoted', answerId);
        } else {
          await reputationService.awardPoints(answer.authorId, 'answer_upvoted', answerId);
        }

        vote = existingVote;
      } else {
        // Different vote type - change the vote
        const updatedVote = await voteRepository.updateVote(existingVote.id, voteType);
        vote = updatedVote!;
        scoreDelta = voteType === 'upvote' ? 2 : -2;

        // Adjust reputation
        const oldAction = existingVote.voteType === 'upvote' ? 'answer_downvoted' : 'answer_upvoted';
        const newAction = voteType === 'upvote' ? 'answer_upvoted' : 'answer_downvoted';
        await reputationService.awardPoints(answer.authorId, oldAction, answerId);
        await reputationService.awardPoints(answer.authorId, newAction, answerId);
      }
    } else {
      // New vote
      vote = await voteRepository.createAnswerVote(auth.userId, answerId, voteType);
      scoreDelta = voteType === 'upvote' ? 1 : -1;

      // Award reputation
      const action = voteType === 'upvote' ? 'answer_upvoted' : 'answer_downvoted';
      await reputationService.awardPoints(answer.authorId, action, answerId);
    }

    // Update answer vote score
    await answerRepository.updateVoteScore(answerId, scoreDelta);

    return {
      vote,
      newScore: answer.voteScore + scoreDelta,
    };
  }

  async getUserVoteOnQuestion(userId: string, questionId: string): Promise<Vote | null> {
    return voteRepository.findUserVoteOnQuestion(userId, questionId);
  }

  async getUserVoteOnAnswer(userId: string, answerId: string): Promise<Vote | null> {
    return voteRepository.findUserVoteOnAnswer(userId, answerId);
  }
}

export const voteService = new VoteService();
