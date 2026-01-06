// import { userRepository } from '../repositories/UserRepository.js';
// import { departmentRepository } from '../repositories/TagRepository.js';
import { mockLeaderboard, mockDepartments, mockUsers } from '../data/mockData.js';
import { LeaderboardEntry, User } from '../types/index.js';

export class LeaderboardService {
  async getOrganizationLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    return mockLeaderboard.slice(0, limit);
  }

  async getDepartmentLeaderboard(
    departmentId: string,
    limit: number = 10
  ): Promise<LeaderboardEntry[]> {
    // Verify department exists
    const department = mockDepartments.find(d => d.id === departmentId);
    if (!department) {
      throw new Error('Department not found');
    }

    // Filter users by department and create leaderboard
    const deptUsers = mockUsers
      .filter(u => u.departmentId === departmentId)
      .sort((a, b) => b.reputation - a.reputation);

    return deptUsers.slice(0, limit).map((user, index) => ({
      rank: index + 1,
      user,
      reputation: user.reputation,
      answersCount: Math.floor(user.reputation / 200),
      acceptedAnswersCount: Math.floor(user.reputation / 500),
    }));
  }
}

export const leaderboardService = new LeaderboardService();
