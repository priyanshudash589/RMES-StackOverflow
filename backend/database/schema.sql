-- =====================================================
-- StackOverflow-Style Knowledge Engine - Database Schema
-- PostgreSQL
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- DEPARTMENTS TABLE
-- =====================================================
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed default departments
INSERT INTO departments (name, description) VALUES
    ('Engineering', 'Software Engineering and Development'),
    ('DevOps', 'DevOps and Infrastructure'),
    ('Data', 'Data Science and Analytics'),
    ('IT', 'Information Technology and Support'),
    ('Security', 'Security and Compliance'),
    ('QA', 'Quality Assurance and Testing');

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    department_id UUID REFERENCES departments(id),
    reputation INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_department ON users(department_id);
CREATE INDEX idx_users_reputation ON users(reputation DESC);

-- =====================================================
-- TAGS TABLE
-- =====================================================
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_tags_usage ON tags(usage_count DESC);

-- Seed common tags
INSERT INTO tags (name, description) VALUES
    ('javascript', 'JavaScript programming language'),
    ('typescript', 'TypeScript programming language'),
    ('python', 'Python programming language'),
    ('react', 'React frontend library'),
    ('nodejs', 'Node.js runtime'),
    ('docker', 'Docker containerization'),
    ('kubernetes', 'Kubernetes orchestration'),
    ('postgresql', 'PostgreSQL database'),
    ('aws', 'Amazon Web Services'),
    ('api', 'API design and implementation');

-- =====================================================
-- QUESTIONS TABLE
-- =====================================================
CREATE TYPE question_status AS ENUM ('open', 'in_review', 'solved', 'documented');

CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(300) NOT NULL,
    body TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES users(id),
    department_id UUID REFERENCES departments(id),
    status question_status DEFAULT 'open',
    accepted_answer_id UUID,  -- Will add FK after answers table
    view_count INTEGER DEFAULT 0,
    vote_score INTEGER DEFAULT 0,
    answer_count INTEGER DEFAULT 0,
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Full-text search vector for future semantic search
    search_vector TSVECTOR
);

CREATE INDEX idx_questions_author ON questions(author_id);
CREATE INDEX idx_questions_department ON questions(department_id);
CREATE INDEX idx_questions_status ON questions(status);
CREATE INDEX idx_questions_created ON questions(created_at DESC);
CREATE INDEX idx_questions_votes ON questions(vote_score DESC);
CREATE INDEX idx_questions_search ON questions USING GIN(search_vector);

-- Trigger to update search vector
CREATE OR REPLACE FUNCTION questions_search_trigger() RETURNS trigger AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.body, '')), 'B');
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER questions_search_update
    BEFORE INSERT OR UPDATE ON questions
    FOR EACH ROW EXECUTE FUNCTION questions_search_trigger();

-- =====================================================
-- QUESTION_TAGS TABLE (Many-to-Many)
-- =====================================================
CREATE TABLE question_tags (
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (question_id, tag_id)
);

CREATE INDEX idx_question_tags_question ON question_tags(question_id);
CREATE INDEX idx_question_tags_tag ON question_tags(tag_id);

-- =====================================================
-- ANSWERS TABLE
-- =====================================================
CREATE TABLE answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id),
    body TEXT NOT NULL,
    vote_score INTEGER DEFAULT 0,
    is_accepted BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_answers_question ON answers(question_id);
CREATE INDEX idx_answers_author ON answers(author_id);
CREATE INDEX idx_answers_votes ON answers(vote_score DESC);

-- Add FK constraint for accepted_answer_id
ALTER TABLE questions 
    ADD CONSTRAINT fk_accepted_answer 
    FOREIGN KEY (accepted_answer_id) REFERENCES answers(id);

-- =====================================================
-- COMMENTS TABLE
-- =====================================================
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    body TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES users(id),
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    answer_id UUID REFERENCES answers(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- A comment must belong to either a question OR an answer
    CONSTRAINT comment_parent_check CHECK (
        (question_id IS NOT NULL AND answer_id IS NULL) OR
        (question_id IS NULL AND answer_id IS NOT NULL)
    )
);

CREATE INDEX idx_comments_question ON comments(question_id);
CREATE INDEX idx_comments_answer ON comments(answer_id);
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_comments_parent ON comments(parent_comment_id);

-- =====================================================
-- VOTES TABLE
-- =====================================================
CREATE TYPE vote_type AS ENUM ('upvote', 'downvote');
CREATE TYPE voteable_type AS ENUM ('question', 'answer');

CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    vote_type vote_type NOT NULL,
    voteable_type voteable_type NOT NULL,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    answer_id UUID REFERENCES answers(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Prevent duplicate voting
    CONSTRAINT unique_question_vote UNIQUE (user_id, question_id),
    CONSTRAINT unique_answer_vote UNIQUE (user_id, answer_id),
    
    -- Vote must target either question OR answer
    CONSTRAINT vote_target_check CHECK (
        (question_id IS NOT NULL AND answer_id IS NULL AND voteable_type = 'question') OR
        (question_id IS NULL AND answer_id IS NOT NULL AND voteable_type = 'answer')
    )
);

CREATE INDEX idx_votes_user ON votes(user_id);
CREATE INDEX idx_votes_question ON votes(question_id);
CREATE INDEX idx_votes_answer ON votes(answer_id);

-- =====================================================
-- REPUTATION HISTORY TABLE (Audit Trail)
-- =====================================================
CREATE TYPE reputation_action AS ENUM (
    'question_upvoted',
    'question_downvoted',
    'answer_upvoted',
    'answer_downvoted',
    'answer_accepted',
    'answer_posted',
    'documentation_approved'
);

CREATE TABLE reputation_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    action reputation_action NOT NULL,
    points INTEGER NOT NULL,
    reference_id UUID,  -- ID of question/answer that caused the change
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reputation_history_user ON reputation_history(user_id);
CREATE INDEX idx_reputation_history_created ON reputation_history(created_at DESC);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to update user reputation
CREATE OR REPLACE FUNCTION update_user_reputation(
    p_user_id UUID,
    p_action reputation_action,
    p_reference_id UUID DEFAULT NULL
) RETURNS INTEGER AS $$
DECLARE
    v_points INTEGER;
BEGIN
    -- Determine points based on action
    v_points := CASE p_action
        WHEN 'question_upvoted' THEN 5
        WHEN 'question_downvoted' THEN -2
        WHEN 'answer_upvoted' THEN 10
        WHEN 'answer_downvoted' THEN -2
        WHEN 'answer_accepted' THEN 25
        WHEN 'answer_posted' THEN 10
        WHEN 'documentation_approved' THEN 15
        ELSE 0
    END;
    
    -- Update user reputation
    UPDATE users SET 
        reputation = reputation + v_points,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_user_id;
    
    -- Record history
    INSERT INTO reputation_history (user_id, action, points, reference_id)
    VALUES (p_user_id, p_action, v_points, p_reference_id);
    
    RETURN v_points;
END;
$$ LANGUAGE plpgsql;

-- Function to find similar questions (basic text search)
CREATE OR REPLACE FUNCTION find_similar_questions(
    p_search_text TEXT,
    p_limit INTEGER DEFAULT 5
) RETURNS TABLE (
    id UUID,
    title VARCHAR(300),
    similarity REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        q.id,
        q.title,
        ts_rank(q.search_vector, plainto_tsquery('english', p_search_text)) AS similarity
    FROM questions q
    WHERE 
        q.is_deleted = false AND
        q.search_vector @@ plainto_tsquery('english', p_search_text)
    ORDER BY similarity DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- UPDATED_AT TRIGGER
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_answers_updated_at BEFORE UPDATE ON answers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
