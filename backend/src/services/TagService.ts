// import { tagRepository, departmentRepository } from '../repositories/TagRepository.js';
import { mockTags, mockDepartments } from '../data/mockData.js';
import { Tag, Department } from '../types/index.js';

export class TagService {
  async getAllTags(): Promise<Tag[]> {
    return mockTags;
  }

  async getPopularTags(limit: number = 20): Promise<Tag[]> {
    return [...mockTags]
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }

  async searchTags(query: string): Promise<Tag[]> {
    const queryLower = query.toLowerCase();
    return mockTags.filter(t => 
      t.name.toLowerCase().includes(queryLower) ||
      (t.description && t.description.toLowerCase().includes(queryLower))
    );
  }

  async getOrCreateTag(name: string, description?: string): Promise<Tag> {
    let tag = mockTags.find(t => t.name.toLowerCase() === name.toLowerCase());
    if (!tag) {
      // Create a new mock tag
      tag = {
        id: `tag-${Date.now()}`,
        name: name.toLowerCase(),
        description: description || null,
        usageCount: 0,
        createdAt: new Date(),
      };
    }
    return tag;
  }
}

export class DepartmentService {
  async getAllDepartments(): Promise<Department[]> {
    return mockDepartments;
  }

  async getDepartmentById(id: string): Promise<Department | null> {
    return mockDepartments.find(d => d.id === id) || null;
  }
}

export const tagService = new TagService();
export const departmentService = new DepartmentService();
