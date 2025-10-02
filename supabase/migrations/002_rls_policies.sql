-- Row Level Security (RLS) Policies
-- Security policies for SkillMatch application

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT role = 'admin'
        FROM public.users
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is recruiter
CREATE OR REPLACE FUNCTION public.is_recruiter()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT role IN ('recruiter', 'admin')
        FROM public.users
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR ALL USING (public.is_admin());

-- Skills table policies (read-only for most users)
CREATE POLICY "Anyone can view skills" ON public.skills
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage skills" ON public.skills
    FOR ALL USING (public.is_admin());

-- User skills policies
CREATE POLICY "Users can view their own skills" ON public.user_skills
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own skills" ON public.user_skills
    FOR ALL USING (auth.uid() = user_id);

-- Resumes table policies
CREATE POLICY "Users can view their own resumes" ON public.resumes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own resumes" ON public.resumes
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Recruiters can view resumes for matching" ON public.resumes
    FOR SELECT USING (
        public.is_recruiter() AND 
        status = 'active' AND
        EXISTS (
            SELECT 1 FROM public.job_matches jm
            WHERE jm.resume_id = id AND jm.user_id = user_id
        )
    );

-- Jobs table policies
CREATE POLICY "Anyone can view active jobs" ON public.jobs
    FOR SELECT TO authenticated USING (status = 'active');

CREATE POLICY "Recruiters can manage their own jobs" ON public.jobs
    FOR ALL USING (auth.uid() = recruiter_id);

CREATE POLICY "Admins can manage all jobs" ON public.jobs
    FOR ALL USING (public.is_admin());

-- Job matches policies
CREATE POLICY "Users can view their own matches" ON public.job_matches
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create matches for their resumes" ON public.job_matches
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own matches" ON public.job_matches
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Recruiters can view matches for their jobs" ON public.job_matches
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.jobs j
            WHERE j.id = job_id AND j.recruiter_id = auth.uid()
        )
    );

-- Skill recommendations policies
CREATE POLICY "Users can view their own recommendations" ON public.skill_recommendations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own recommendations" ON public.skill_recommendations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create recommendations" ON public.skill_recommendations
    FOR INSERT WITH CHECK (true); -- This will be handled by server-side functions

-- User analytics policies
CREATE POLICY "Users can view their own analytics" ON public.user_analytics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert analytics" ON public.user_analytics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all analytics" ON public.user_analytics
    FOR SELECT USING (public.is_admin());

-- Feedback policies
CREATE POLICY "Users can view their own feedback" ON public.feedback
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create feedback" ON public.feedback
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback" ON public.feedback
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all feedback" ON public.feedback
    FOR ALL USING (public.is_admin());

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON public.notifications
    FOR INSERT WITH CHECK (true); -- Handled by server-side functions

-- Saved jobs policies
CREATE POLICY "Users can manage their saved jobs" ON public.saved_jobs
    FOR ALL USING (auth.uid() = user_id);

-- Job applications policies
CREATE POLICY "Users can view their own applications" ON public.job_applications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own applications" ON public.job_applications
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Recruiters can view applications for their jobs" ON public.job_applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.jobs j
            WHERE j.id = job_id AND j.recruiter_id = auth.uid()
        )
    );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

