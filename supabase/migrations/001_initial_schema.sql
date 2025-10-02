-- SkillMatch Database Schema
-- Initial migration for Supabase backend

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('job_seeker', 'recruiter', 'admin');
CREATE TYPE resume_status AS ENUM ('draft', 'active', 'archived');
CREATE TYPE job_status AS ENUM ('active', 'closed', 'draft');
CREATE TYPE match_status AS ENUM ('pending', 'completed', 'failed');
CREATE TYPE skill_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE notification_type AS ENUM ('match_found', 'skill_recommendation', 'system_update');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role user_role DEFAULT 'job_seeker',
    avatar_url TEXT,
    phone TEXT,
    location TEXT,
    bio TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    years_experience INTEGER DEFAULT 0,
    current_position TEXT,
    current_company TEXT,
    preferences JSONB DEFAULT '{}',
    settings JSONB DEFAULT '{"notifications": true, "privacy": "public"}',
    is_verified BOOLEAN DEFAULT FALSE,
    subscription_tier TEXT DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills catalog table
CREATE TABLE public.skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    popularity_score INTEGER DEFAULT 0,
    demand_score INTEGER DEFAULT 0,
    avg_salary_impact DECIMAL(10,2),
    related_skills TEXT[],
    learning_resources JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User skills junction table
CREATE TABLE public.user_skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    level skill_level DEFAULT 'beginner',
    years_experience INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    endorsements INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, skill_id)
);

-- Resumes table
CREATE TABLE public.resumes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    file_name TEXT,
    file_path TEXT,
    file_size INTEGER,
    file_type TEXT,
    status resume_status DEFAULT 'draft',
    version INTEGER DEFAULT 1,
    is_primary BOOLEAN DEFAULT FALSE,
    
    -- Parsed resume data
    parsed_data JSONB DEFAULT '{}',
    extracted_text TEXT,
    contact_info JSONB DEFAULT '{}',
    work_experience JSONB DEFAULT '[]',
    education JSONB DEFAULT '[]',
    skills_extracted TEXT[],
    certifications JSONB DEFAULT '[]',
    
    -- ATS optimization data
    ats_score INTEGER,
    ats_feedback JSONB DEFAULT '{}',
    keyword_density JSONB DEFAULT '{}',
    formatting_issues TEXT[],
    
    -- Metadata
    parse_status TEXT DEFAULT 'pending',
    parse_error TEXT,
    last_analyzed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table
CREATE TABLE public.jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    recruiter_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    job_type TEXT, -- full-time, part-time, contract, etc.
    experience_level TEXT, -- entry, mid, senior, executive
    salary_min INTEGER,
    salary_max INTEGER,
    currency TEXT DEFAULT 'USD',
    
    -- Job details
    description TEXT NOT NULL,
    requirements TEXT,
    responsibilities TEXT,
    benefits TEXT,
    remote_allowed BOOLEAN DEFAULT FALSE,
    
    -- Parsed job data
    required_skills TEXT[],
    preferred_skills TEXT[],
    parsed_requirements JSONB DEFAULT '{}',
    
    -- Job metadata
    status job_status DEFAULT 'draft',
    external_job_id TEXT, -- for jobs from external APIs
    source TEXT DEFAULT 'internal', -- internal, indeed, linkedin, etc.
    application_url TEXT,
    application_deadline DATE,
    views_count INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job matches table
CREATE TABLE public.job_matches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    
    -- Match results
    overall_score DECIMAL(5,2) NOT NULL, -- 0.00 to 100.00
    skills_match_score DECIMAL(5,2),
    experience_match_score DECIMAL(5,2),
    education_match_score DECIMAL(5,2),
    
    -- Detailed analysis
    matched_skills TEXT[],
    missing_skills TEXT[],
    skill_gaps JSONB DEFAULT '[]',
    recommendations JSONB DEFAULT '[]',
    
    -- Match metadata
    status match_status DEFAULT 'pending',
    algorithm_version TEXT DEFAULT 'v1.0',
    processing_time_ms INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, resume_id, job_id)
);

-- Skill recommendations table
CREATE TABLE public.skill_recommendations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    
    -- Recommendation details
    reason TEXT NOT NULL, -- why this skill is recommended
    priority_score DECIMAL(5,2) DEFAULT 0, -- 0-100
    market_demand_score DECIMAL(5,2),
    salary_impact_score DECIMAL(5,2),
    
    -- Learning path
    estimated_learning_time_hours INTEGER,
    difficulty_level skill_level DEFAULT 'beginner',
    prerequisites TEXT[],
    learning_path JSONB DEFAULT '[]',
    
    -- User interaction
    is_dismissed BOOLEAN DEFAULT FALSE,
    is_bookmarked BOOLEAN DEFAULT FALSE,
    user_rating INTEGER, -- 1-5 stars
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User activity analytics
CREATE TABLE public.user_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Activity data
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    session_id TEXT,
    ip_address INET,
    user_agent TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feedback and ratings
CREATE TABLE public.feedback (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Feedback details
    type TEXT NOT NULL, -- match_accuracy, skill_recommendation, general, bug_report
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    message TEXT,
    
    -- Context
    related_match_id UUID REFERENCES public.job_matches(id),
    related_recommendation_id UUID REFERENCES public.skill_recommendations(id),
    
    -- Status
    status TEXT DEFAULT 'open', -- open, in_progress, resolved, closed
    admin_response TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Notification details
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    is_email_sent BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved jobs table
CREATE TABLE public.saved_jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, job_id)
);

-- Job applications table
CREATE TABLE public.job_applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
    
    -- Application details
    status TEXT DEFAULT 'applied', -- applied, screening, interview, offer, rejected, withdrawn
    cover_letter TEXT,
    application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Tracking
    last_status_update TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, job_id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_created_at ON public.users(created_at);
CREATE INDEX idx_resumes_user_id ON public.resumes(user_id);
CREATE INDEX idx_resumes_status ON public.resumes(status);
CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_jobs_company ON public.jobs(company);
CREATE INDEX idx_jobs_location ON public.jobs(location);
CREATE INDEX idx_jobs_created_at ON public.jobs(created_at);
CREATE INDEX idx_job_matches_user_id ON public.job_matches(user_id);
CREATE INDEX idx_job_matches_job_id ON public.job_matches(job_id);
CREATE INDEX idx_job_matches_score ON public.job_matches(overall_score DESC);
CREATE INDEX idx_skill_recommendations_user_id ON public.skill_recommendations(user_id);
CREATE INDEX idx_user_analytics_user_id ON public.user_analytics(user_id);
CREATE INDEX idx_user_analytics_event_type ON public.user_analytics(event_type);
CREATE INDEX idx_notifications_user_id_unread ON public.notifications(user_id, is_read);
CREATE INDEX idx_skills_category ON public.skills(category);
CREATE INDEX idx_skills_popularity ON public.skills(popularity_score DESC);

-- Create full-text search indexes
CREATE INDEX idx_jobs_search ON public.jobs USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_skills_search ON public.skills USING gin(to_tsvector('english', name || ' ' || description));

