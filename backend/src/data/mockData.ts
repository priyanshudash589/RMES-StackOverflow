// =====================================================
// Mock Data for Development (PostgreSQL commented out)
// =====================================================

import {
  User,
  Department,
  Tag,
  Question,
  Answer,
  Comment,
  LeaderboardEntry,
  SimilarQuestion,
} from '../types/index.js';

// =====================================================
// Departments (Teams/Divisions in the company)
// =====================================================
export const mockDepartments: Department[] = [
  {
    id: 'dept-1',
    name: 'Engineering',
    description: 'Software Engineering and Development Team',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'dept-2',
    name: 'DevOps',
    description: 'Infrastructure, CI/CD, and Cloud Operations',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'dept-3',
    name: 'Data Science',
    description: 'Machine Learning and Analytics Team',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'dept-4',
    name: 'Security',
    description: 'Information Security and Compliance',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'dept-5',
    name: 'Product',
    description: 'Product Management and Design',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// =====================================================
// Users (Employees)
// =====================================================
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'sarah.chen@company.com',
    displayName: 'Sarah Chen',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    departmentId: 'dept-1',
    department: mockDepartments[0],
    reputation: 15420,
    isActive: true,
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2025-01-05'),
  },
  {
    id: 'user-2',
    email: 'marcus.johnson@company.com',
    displayName: 'Marcus Johnson',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    departmentId: 'dept-2',
    department: mockDepartments[1],
    reputation: 12850,
    isActive: true,
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2025-01-04'),
  },
  {
    id: 'user-3',
    email: 'priya.sharma@company.com',
    displayName: 'Priya Sharma',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    departmentId: 'dept-3',
    department: mockDepartments[2],
    reputation: 9340,
    isActive: true,
    createdAt: new Date('2023-08-10'),
    updatedAt: new Date('2025-01-03'),
  },
  {
    id: 'user-4',
    email: 'alex.rodriguez@company.com',
    displayName: 'Alex Rodriguez',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    departmentId: 'dept-1',
    department: mockDepartments[0],
    reputation: 7650,
    isActive: true,
    createdAt: new Date('2023-11-01'),
    updatedAt: new Date('2025-01-02'),
  },
  {
    id: 'user-5',
    email: 'emma.wilson@company.com',
    displayName: 'Emma Wilson',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    departmentId: 'dept-4',
    department: mockDepartments[3],
    reputation: 6820,
    isActive: true,
    createdAt: new Date('2023-09-05'),
    updatedAt: new Date('2025-01-01'),
  },
  {
    id: 'user-6',
    email: 'james.kim@company.com',
    displayName: 'James Kim',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    departmentId: 'dept-2',
    department: mockDepartments[1],
    reputation: 5430,
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2025-01-05'),
  },
  {
    id: 'user-7',
    email: 'lisa.patel@company.com',
    displayName: 'Lisa Patel',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    departmentId: 'dept-5',
    department: mockDepartments[4],
    reputation: 4210,
    isActive: true,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2025-01-04'),
  },
  {
    id: 'user-8',
    email: 'david.brown@company.com',
    displayName: 'David Brown',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    departmentId: 'dept-3',
    department: mockDepartments[2],
    reputation: 3890,
    isActive: true,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2025-01-03'),
  },
];

// =====================================================
// Tags (Technical Topics)
// =====================================================
export const mockTags: Tag[] = [
  { id: 'tag-1', name: 'kubernetes', description: 'Container orchestration', usageCount: 156, createdAt: new Date('2024-01-01') },
  { id: 'tag-2', name: 'docker', description: 'Containerization platform', usageCount: 203, createdAt: new Date('2024-01-01') },
  { id: 'tag-3', name: 'react', description: 'JavaScript UI library', usageCount: 189, createdAt: new Date('2024-01-01') },
  { id: 'tag-4', name: 'typescript', description: 'Typed JavaScript', usageCount: 234, createdAt: new Date('2024-01-01') },
  { id: 'tag-5', name: 'python', description: 'Programming language', usageCount: 278, createdAt: new Date('2024-01-01') },
  { id: 'tag-6', name: 'aws', description: 'Amazon Web Services', usageCount: 167, createdAt: new Date('2024-01-01') },
  { id: 'tag-7', name: 'postgresql', description: 'Relational database', usageCount: 145, createdAt: new Date('2024-01-01') },
  { id: 'tag-8', name: 'redis', description: 'In-memory data store', usageCount: 98, createdAt: new Date('2024-01-01') },
  { id: 'tag-9', name: 'graphql', description: 'Query language for APIs', usageCount: 87, createdAt: new Date('2024-01-01') },
  { id: 'tag-10', name: 'ci-cd', description: 'Continuous Integration/Deployment', usageCount: 134, createdAt: new Date('2024-01-01') },
  { id: 'tag-11', name: 'security', description: 'Application security', usageCount: 112, createdAt: new Date('2024-01-01') },
  { id: 'tag-12', name: 'performance', description: 'Performance optimization', usageCount: 156, createdAt: new Date('2024-01-01') },
];

// =====================================================
// Questions with realistic enterprise content
// =====================================================
export const mockQuestions: Question[] = [
  {
    id: 'q-1',
    title: 'How to implement blue-green deployment for our microservices on Kubernetes?',
    body: `We're currently running 15 microservices on our Kubernetes cluster and want to implement blue-green deployments to achieve zero-downtime releases.

**Current Setup:**
- GKE cluster with 3 node pools
- Services communicate via internal load balancers
- Using Helm for deployments

**What I've Tried:**
- Looked at Istio service mesh but it seems complex for our needs
- Considered Argo Rollouts but unsure about the learning curve

**Questions:**
1. What's the recommended approach for blue-green on K8s?
2. How do we handle database migrations during the switch?
3. Any gotchas with session management?

Thanks in advance!`,
    authorId: 'user-4',
    author: mockUsers[3],
    departmentId: 'dept-2',
    department: mockDepartments[1],
    status: 'solved',
    acceptedAnswerId: 'a-1',
    viewCount: 342,
    voteScore: 28,
    answerCount: 3,
    isDeleted: false,
    deletedAt: null,
    tags: [mockTags[0], mockTags[1], mockTags[9]],
    createdAt: new Date('2025-01-02T10:30:00'),
    updatedAt: new Date('2025-01-03T14:20:00'),
  },
  {
    id: 'q-2',
    title: 'Best practices for handling JWT refresh tokens in React SPA?',
    body: `Our React application uses JWT for authentication. We need to implement a secure refresh token mechanism.

**Current Implementation:**
- Access token stored in memory (React state)
- Refresh token in HttpOnly cookie
- Token refresh on 401 response

**Issues We're Facing:**
- Race conditions when multiple API calls fail simultaneously
- Token refresh during background sync operations
- Handling refresh token rotation

**Code snippet of current approach:**
\`\`\`typescript
const refreshToken = async () => {
  try {
    const response = await axios.post('/api/auth/refresh');
    setAccessToken(response.data.accessToken);
    return response.data.accessToken;
  } catch (error) {
    logout();
    throw error;
  }
};
\`\`\`

What's the recommended pattern for this in 2025?`,
    authorId: 'user-1',
    author: mockUsers[0],
    departmentId: 'dept-1',
    department: mockDepartments[0],
    status: 'open',
    acceptedAnswerId: null,
    viewCount: 189,
    voteScore: 15,
    answerCount: 2,
    isDeleted: false,
    deletedAt: null,
    tags: [mockTags[2], mockTags[3], mockTags[10]],
    createdAt: new Date('2025-01-04T09:15:00'),
    updatedAt: new Date('2025-01-04T16:45:00'),
  },
  {
    id: 'q-3',
    title: 'Optimizing PostgreSQL queries for large time-series data analytics',
    body: `We have a PostgreSQL database with 500M+ rows of time-series sensor data. Query performance is degrading.

**Table Structure:**
\`\`\`sql
CREATE TABLE sensor_readings (
  id BIGSERIAL PRIMARY KEY,
  sensor_id UUID NOT NULL,
  reading_value DECIMAL(10,4),
  recorded_at TIMESTAMPTZ NOT NULL,
  metadata JSONB
);

CREATE INDEX idx_sensor_recorded ON sensor_readings(sensor_id, recorded_at DESC);
\`\`\`

**Problem Queries:**
- Aggregations over 30-day windows: ~8 seconds
- Latest reading per sensor (1000+ sensors): ~12 seconds

**What We've Tried:**
- BRIN indexes (slight improvement)
- Partitioning by month (helped with some queries)
- Materialized views (refresh is too slow)

Looking for advice on:
1. TimescaleDB vs native pg_partman?
2. Continuous aggregation strategies
3. Query optimization patterns for this use case`,
    authorId: 'user-3',
    author: mockUsers[2],
    departmentId: 'dept-3',
    department: mockDepartments[2],
    status: 'in_review',
    acceptedAnswerId: null,
    viewCount: 456,
    voteScore: 42,
    answerCount: 4,
    isDeleted: false,
    deletedAt: null,
    tags: [mockTags[6], mockTags[11], mockTags[4]],
    createdAt: new Date('2025-01-01T14:20:00'),
    updatedAt: new Date('2025-01-05T11:30:00'),
  },
  {
    id: 'q-4',
    title: 'Setting up end-to-end encryption for internal microservice communication',
    body: `Security audit revealed we need to encrypt all internal service-to-service communication. Currently using plain HTTP within our VPC.

**Environment:**
- 25 microservices on AWS ECS
- Service discovery via AWS Cloud Map
- ALB for external traffic (already has TLS)

**Requirements:**
- mTLS between all services
- Certificate rotation without downtime
- Minimal performance overhead

**Questions:**
1. Should we use AWS ACM Private CA or self-managed?
2. Best approach for certificate distribution to containers?
3. How to handle certificate rotation in a containerized environment?

Any experience with this at scale would be helpful!`,
    authorId: 'user-5',
    author: mockUsers[4],
    departmentId: 'dept-4',
    department: mockDepartments[3],
    status: 'open',
    acceptedAnswerId: null,
    viewCount: 234,
    voteScore: 31,
    answerCount: 2,
    isDeleted: false,
    deletedAt: null,
    tags: [mockTags[5], mockTags[10], mockTags[9]],
    createdAt: new Date('2025-01-03T16:45:00'),
    updatedAt: new Date('2025-01-04T10:15:00'),
  },
  {
    id: 'q-5',
    title: 'Implementing feature flags with gradual rollout and A/B testing',
    body: `We want to implement a feature flag system that supports:
- Gradual percentage rollouts
- User segment targeting
- A/B testing with metrics tracking
- Kill switches for quick rollback

**Tech Stack:**
- React frontend
- Node.js/Express backend
- PostgreSQL database

**Options Considered:**
1. LaunchDarkly (expensive for our scale)
2. Unleash (self-hosted)
3. Custom implementation

Has anyone built this in-house? What are the gotchas?

Specifically interested in:
- Database schema design for flag evaluation
- Caching strategies to minimize latency
- SDK design for frontend/backend consistency`,
    authorId: 'user-7',
    author: mockUsers[6],
    departmentId: 'dept-5',
    department: mockDepartments[4],
    status: 'solved',
    acceptedAnswerId: 'a-5',
    viewCount: 567,
    voteScore: 38,
    answerCount: 5,
    isDeleted: false,
    deletedAt: null,
    tags: [mockTags[2], mockTags[3], mockTags[6]],
    createdAt: new Date('2024-12-28T11:00:00'),
    updatedAt: new Date('2025-01-02T09:30:00'),
  },
  {
    id: 'q-6',
    title: 'Redis cluster failover causing data inconsistency in distributed cache',
    body: `We're experiencing data inconsistency issues when our Redis cluster performs automatic failover.

**Setup:**
- Redis Cluster with 6 nodes (3 masters, 3 replicas)
- Used for session storage and API response caching
- Client: ioredis with cluster mode

**Problem:**
During failover:
1. Some writes to the old master are lost
2. Read-after-write consistency breaks for ~2 seconds
3. Client gets MOVED errors during slot migration

**Code Example:**
\`\`\`javascript
const redis = new Redis.Cluster([
  { host: 'redis-1.internal', port: 6379 },
  { host: 'redis-2.internal', port: 6379 },
], {
  redisOptions: { password: process.env.REDIS_PASSWORD }
});
\`\`\`

How are others handling this? Is there a pattern for graceful degradation?`,
    authorId: 'user-2',
    author: mockUsers[1],
    departmentId: 'dept-2',
    department: mockDepartments[1],
    status: 'open',
    acceptedAnswerId: null,
    viewCount: 298,
    voteScore: 24,
    answerCount: 3,
    isDeleted: false,
    deletedAt: null,
    tags: [mockTags[7], mockTags[11], mockTags[5]],
    createdAt: new Date('2025-01-05T08:30:00'),
    updatedAt: new Date('2025-01-05T15:45:00'),
  },
  {
    id: 'q-7',
    title: 'GraphQL DataLoader patterns for complex nested resolvers',
    body: `Our GraphQL API has N+1 query problems with deeply nested data.

**Schema Example:**
\`\`\`graphql
type Organization {
  teams: [Team!]!
}

type Team {
  members: [User!]!
  projects: [Project!]!
}

type User {
  recentActivity: [Activity!]!
}
\`\`\`

**Current Issue:**
A single org query with 10 teams, 50 users triggers hundreds of DB queries.

**What I've Tried:**
- Basic DataLoader for users and teams
- Batch loading for single-level nesting

**Questions:**
1. How to handle nested DataLoaders (user -> activity)?
2. Caching strategies across resolver calls
3. When to use DataLoader vs JOIN in resolvers?`,
    authorId: 'user-1',
    author: mockUsers[0],
    departmentId: 'dept-1',
    department: mockDepartments[0],
    status: 'solved',
    acceptedAnswerId: 'a-7',
    viewCount: 423,
    voteScore: 35,
    answerCount: 4,
    isDeleted: false,
    deletedAt: null,
    tags: [mockTags[8], mockTags[3], mockTags[11]],
    createdAt: new Date('2024-12-30T13:15:00'),
    updatedAt: new Date('2025-01-03T17:20:00'),
  },
  {
    id: 'q-8',
    title: 'Migrating from monolith to microservices: strangler fig pattern implementation',
    body: `We're breaking down our 8-year-old Django monolith into microservices. Planning to use the strangler fig pattern.

**Current State:**
- Django 3.2 monolith (~500k LOC)
- PostgreSQL with 200+ tables
- Heavy use of Django ORM relationships

**Target Architecture:**
- New services in Node.js/TypeScript
- Event-driven communication (Kafka)
- API Gateway for routing

**Specific Questions:**
1. How to handle cross-service transactions (e.g., order + inventory)?
2. Strategies for gradual data migration without downtime
3. Dealing with circular dependencies in the monolith

Has anyone done this at similar scale? Would love to hear lessons learned.`,
    authorId: 'user-4',
    author: mockUsers[3],
    departmentId: 'dept-1',
    department: mockDepartments[0],
    status: 'in_review',
    acceptedAnswerId: null,
    viewCount: 678,
    voteScore: 52,
    answerCount: 6,
    isDeleted: false,
    deletedAt: null,
    tags: [mockTags[4], mockTags[3], mockTags[6]],
    createdAt: new Date('2024-12-25T10:00:00'),
    updatedAt: new Date('2025-01-04T14:30:00'),
  },
];

// =====================================================
// Answers with realistic technical content
// =====================================================
export const mockAnswers: Answer[] = [
  {
    id: 'a-1',
    questionId: 'q-1',
    authorId: 'user-2',
    author: mockUsers[1],
    body: `Great question! We implemented blue-green on K8s last year. Here's what worked for us:

## Recommended Approach: Service Mesh with Istio or Argo Rollouts

For your scale (15 services), I'd recommend **Argo Rollouts** - it's simpler than full Istio and purpose-built for progressive delivery.

### Implementation Steps:

1. **Install Argo Rollouts:**
\`\`\`bash
kubectl create namespace argo-rollouts
kubectl apply -n argo-rollouts -f https://github.com/argoproj/argo-rollouts/releases/latest/download/install.yaml
\`\`\`

2. **Convert Deployments to Rollouts:**
\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: my-service
spec:
  replicas: 3
  strategy:
    blueGreen:
      activeService: my-service-active
      previewService: my-service-preview
      autoPromotionEnabled: false
\`\`\`

### Database Migrations:
- Run migrations **before** the blue-green switch
- Ensure backward compatibility (add columns, don't remove)
- Use expand-contract pattern for breaking changes

### Session Management Gotchas:
- Store sessions in Redis, not in-memory
- Use sticky sessions during transition if needed
- Consider JWT tokens for stateless auth

Happy to share our Helm charts if helpful!`,
    voteScore: 45,
    isAccepted: true,
    isDeleted: false,
    deletedAt: null,
    createdAt: new Date('2025-01-02T14:30:00'),
    updatedAt: new Date('2025-01-02T14:30:00'),
  },
  {
    id: 'a-2',
    questionId: 'q-1',
    authorId: 'user-6',
    author: mockUsers[5],
    body: `Adding to Marcus's excellent answer - we use a simpler approach with native K8s:

## Alternative: Labels + Service Selector Switching

\`\`\`yaml
# Blue deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app-blue
spec:
  selector:
    matchLabels:
      app: my-app
      version: blue
---
# Service switches between blue/green
apiVersion: v1
kind: Service
metadata:
  name: my-app
spec:
  selector:
    app: my-app
    version: blue  # Switch to 'green' for cutover
\`\`\`

This works well for smaller setups and doesn't require additional tooling.

The downside: no built-in traffic splitting or automated rollback like Argo provides.`,
    voteScore: 18,
    isAccepted: false,
    isDeleted: false,
    deletedAt: null,
    createdAt: new Date('2025-01-02T16:45:00'),
    updatedAt: new Date('2025-01-02T16:45:00'),
  },
  {
    id: 'a-3',
    questionId: 'q-2',
    authorId: 'user-5',
    author: mockUsers[4],
    body: `Here's a battle-tested pattern we use for JWT refresh:

## Request Queue Pattern

\`\`\`typescript
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = \`Bearer \${token}\`;
          return axios(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post('/api/auth/refresh');
        setAccessToken(data.accessToken);
        processQueue(null, data.accessToken);
        originalRequest.headers.Authorization = \`Bearer \${data.accessToken}\`;
        return axios(originalRequest);
      } catch (err) {
        processQueue(err as Error, null);
        logout();
        throw err;
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
\`\`\`

This handles race conditions by queuing requests during refresh.`,
    voteScore: 22,
    isAccepted: false,
    isDeleted: false,
    deletedAt: null,
    createdAt: new Date('2025-01-04T11:30:00'),
    updatedAt: new Date('2025-01-04T11:30:00'),
  },
  {
    id: 'a-4',
    questionId: 'q-3',
    authorId: 'user-8',
    author: mockUsers[7],
    body: `I work on our analytics platform with similar data volumes. Here's our approach:

## TimescaleDB Recommendation

For 500M+ rows of time-series, **TimescaleDB** is the clear winner over pg_partman:

1. **Automatic time-based partitioning** (hypertables)
2. **Continuous aggregates** with real-time updates
3. **Compression** achieving 90%+ space savings

### Migration Steps:

\`\`\`sql
-- Convert to hypertable
SELECT create_hypertable('sensor_readings', 'recorded_at',
  chunk_time_interval => INTERVAL '1 day');

-- Create continuous aggregate
CREATE MATERIALIZED VIEW sensor_daily_agg
WITH (timescaledb.continuous) AS
SELECT
  sensor_id,
  time_bucket('1 hour', recorded_at) AS bucket,
  AVG(reading_value) as avg_value,
  COUNT(*) as reading_count
FROM sensor_readings
GROUP BY sensor_id, bucket;

-- Add refresh policy
SELECT add_continuous_aggregate_policy('sensor_daily_agg',
  start_offset => INTERVAL '3 days',
  end_offset => INTERVAL '1 hour',
  schedule_interval => INTERVAL '1 hour');
\`\`\`

Our 30-day aggregations went from 8s → 50ms after this.`,
    voteScore: 38,
    isAccepted: false,
    isDeleted: false,
    deletedAt: null,
    createdAt: new Date('2025-01-02T09:15:00'),
    updatedAt: new Date('2025-01-02T09:15:00'),
  },
  {
    id: 'a-5',
    questionId: 'q-5',
    authorId: 'user-1',
    author: mockUsers[0],
    body: `We built our own feature flag system! Here's the architecture:

## Database Schema

\`\`\`sql
CREATE TABLE feature_flags (
  id UUID PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  enabled BOOLEAN DEFAULT false,
  rollout_percentage INTEGER DEFAULT 0,
  targeting_rules JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE flag_overrides (
  flag_id UUID REFERENCES feature_flags(id),
  user_id VARCHAR(255),
  segment VARCHAR(100),
  enabled BOOLEAN NOT NULL,
  PRIMARY KEY (flag_id, user_id, segment)
);
\`\`\`

## Evaluation Logic

\`\`\`typescript
function evaluateFlag(flagKey: string, context: UserContext): boolean {
  const flag = getCachedFlag(flagKey);
  if (!flag || !flag.enabled) return false;

  // Check user override
  const override = getOverride(flag.id, context.userId);
  if (override !== undefined) return override;

  // Check segment rules
  if (matchesSegment(flag.targetingRules, context)) {
    return true;
  }

  // Percentage rollout (consistent hashing)
  const hash = murmurHash(\`\${flagKey}:\${context.userId}\`);
  return (hash % 100) < flag.rolloutPercentage;
}
\`\`\`

## Caching Strategy
- Redis cache with 60s TTL
- In-memory LRU cache (5s) for hot paths
- Pub/sub for cache invalidation

Happy to share the full implementation!`,
    voteScore: 42,
    isAccepted: true,
    isDeleted: false,
    deletedAt: null,
    createdAt: new Date('2024-12-29T14:00:00'),
    updatedAt: new Date('2024-12-29T14:00:00'),
  },
  {
    id: 'a-7',
    questionId: 'q-7',
    authorId: 'user-3',
    author: mockUsers[2],
    body: `Here's how we solved nested DataLoader issues:

## Nested DataLoader Pattern

\`\`\`typescript
// Create a context with all loaders
export function createLoaders() {
  return {
    userLoader: new DataLoader(batchGetUsers),
    activityLoader: new DataLoader(batchGetActivities),
    teamLoader: new DataLoader(batchGetTeams),
  };
}

// In resolver - pass parent IDs down
const resolvers = {
  Team: {
    members: async (team, _, { loaders }) => {
      // Load all members at once
      return loaders.userLoader.loadMany(team.memberIds);
    }
  },
  User: {
    recentActivity: async (user, _, { loaders }) => {
      // Activities are keyed by user
      return loaders.activityLoader.load(user.id);
    }
  }
};
\`\`\`

## Key Insights:

1. **Create loaders per-request** (in context factory)
2. **Batch function receives all keys at once** - make a single query
3. **Order results by input key order** - DataLoader requirement!

## When to JOIN vs DataLoader:
- JOIN: When you always need nested data together
- DataLoader: When nesting is conditional/variable
- Most cases: Start with DataLoader, optimize to JOIN if needed`,
    voteScore: 29,
    isAccepted: true,
    isDeleted: false,
    deletedAt: null,
    createdAt: new Date('2024-12-31T10:30:00'),
    updatedAt: new Date('2024-12-31T10:30:00'),
  },
];

// =====================================================
// Comments
// =====================================================
export const mockComments: Comment[] = [
  {
    id: 'c-1',
    body: 'Have you considered using Flagger instead of Argo Rollouts? We found it simpler for basic blue-green.',
    authorId: 'user-3',
    author: mockUsers[2],
    questionId: 'q-1',
    answerId: null,
    parentCommentId: null,
    isDeleted: false,
    deletedAt: null,
    createdAt: new Date('2025-01-02T11:45:00'),
    updatedAt: new Date('2025-01-02T11:45:00'),
  },
  {
    id: 'c-2',
    body: 'Great answer! One addition: consider using AbortController to cancel pending requests during logout.',
    authorId: 'user-4',
    author: mockUsers[3],
    questionId: null,
    answerId: 'a-3',
    parentCommentId: null,
    isDeleted: false,
    deletedAt: null,
    createdAt: new Date('2025-01-04T12:15:00'),
    updatedAt: new Date('2025-01-04T12:15:00'),
  },
  {
    id: 'c-3',
    body: 'We switched to TimescaleDB last month - the compression alone saved us $2k/month in storage costs!',
    authorId: 'user-6',
    author: mockUsers[5],
    questionId: null,
    answerId: 'a-4',
    parentCommentId: null,
    isDeleted: false,
    deletedAt: null,
    createdAt: new Date('2025-01-02T10:30:00'),
    updatedAt: new Date('2025-01-02T10:30:00'),
  },
];

// =====================================================
// Leaderboard Helper
// =====================================================
export const mockLeaderboard: LeaderboardEntry[] = mockUsers
  .sort((a, b) => b.reputation - a.reputation)
  .map((user, index) => ({
    rank: index + 1,
    user,
    reputation: user.reputation,
    answersCount: Math.floor(user.reputation / 200),
    acceptedAnswersCount: Math.floor(user.reputation / 500),
  }));

// =====================================================
// Helper Functions
// =====================================================
export function getQuestionWithDetails(questionId: string): Question | null {
  const question = mockQuestions.find(q => q.id === questionId);
  if (!question) return null;

  // Attach answers and comments
  const answers = mockAnswers
    .filter(a => a.questionId === questionId)
    .map(answer => ({
      ...answer,
      comments: mockComments.filter(c => c.answerId === answer.id),
    }));

  const comments = mockComments.filter(c => c.questionId === questionId);

  return {
    ...question,
    answers,
    comments,
  };
}

export function getSimilarQuestions(title: string): SimilarQuestion[] {
  // Simple word matching for demo
  const words = title.toLowerCase().split(/\s+/);
  return mockQuestions
    .filter(q => words.some(w => q.title.toLowerCase().includes(w)))
    .slice(0, 5)
    .map(q => ({
      id: q.id,
      title: q.title,
      similarity: 0.7 + Math.random() * 0.25,
    }));
}
