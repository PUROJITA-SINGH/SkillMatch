-- Database Functions and Triggers
-- Automated functions for SkillMatch application

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_skills_updated_at
    BEFORE UPDATE ON public.skills
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resumes_updated_at
    BEFORE UPDATE ON public.resumes
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
    BEFORE UPDATE ON public.jobs
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_matches_updated_at
    BEFORE UPDATE ON public.job_matches
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_skill_recommendations_updated_at
    BEFORE UPDATE ON public.skill_recommendations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_feedback_updated_at
    BEFORE UPDATE ON public.feedback
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at
    BEFORE UPDATE ON public.job_applications
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to ensure only one primary resume per user
CREATE OR REPLACE FUNCTION public.ensure_single_primary_resume()
RETURNS TRIGGER AS $$
BEGIN
    -- If setting this resume as primary, unset all other primary resumes for this user
    IF NEW.is_primary = TRUE THEN
        UPDATE public.resumes
        SET is_primary = FALSE
        WHERE user_id = NEW.user_id AND id != NEW.id;
    END IF;
    
    -- If no primary resume exists for user, make this one primary
    IF NOT EXISTS (
        SELECT 1 FROM public.resumes
        WHERE user_id = NEW.user_id AND is_primary = TRUE AND id != NEW.id
    ) THEN
        NEW.is_primary = TRUE;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for primary resume management
CREATE TRIGGER ensure_primary_resume
    BEFORE INSERT OR UPDATE ON public.resumes
    FOR EACH ROW EXECUTE FUNCTION public.ensure_single_primary_resume();

-- Function to update job views count
CREATE OR REPLACE FUNCTION public.increment_job_views(job_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.jobs
    SET views_count = views_count + 1
    WHERE id = job_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate match score (simplified version)
CREATE OR REPLACE FUNCTION public.calculate_match_score(
    resume_skills TEXT[],
    job_required_skills TEXT[],
    job_preferred_skills TEXT[] DEFAULT '{}'
)
RETURNS DECIMAL AS $$
DECLARE
    required_matches INTEGER := 0;
    preferred_matches INTEGER := 0;
    total_required INTEGER;
    total_preferred INTEGER;
    score DECIMAL := 0;
BEGIN
    total_required := array_length(job_required_skills, 1);
    total_preferred := array_length(job_preferred_skills, 1);
    
    -- Count required skill matches
    SELECT COUNT(*)
    INTO required_matches
    FROM unnest(resume_skills) AS skill
    WHERE skill = ANY(job_required_skills);
    
    -- Count preferred skill matches
    SELECT COUNT(*)
    INTO preferred_matches
    FROM unnest(resume_skills) AS skill
    WHERE skill = ANY(job_preferred_skills);
    
    -- Calculate weighted score (required skills worth 70%, preferred 30%)
    IF total_required > 0 THEN
        score := score + (required_matches::DECIMAL / total_required) * 70;
    END IF;
    
    IF total_preferred > 0 THEN
        score := score + (preferred_matches::DECIMAL / total_preferred) * 30;
    END IF;
    
    RETURN LEAST(score, 100); -- Cap at 100%
END;
$$ LANGUAGE plpgsql;

-- Function to create skill recommendations based on job matches
CREATE OR REPLACE FUNCTION public.generate_skill_recommendations(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
    missing_skill TEXT;
    skill_record RECORD;
BEGIN
    -- Delete existing recommendations for this user
    DELETE FROM public.skill_recommendations WHERE user_id = user_uuid;
    
    -- Find missing skills from recent job matches
    FOR missing_skill IN
        SELECT DISTINCT unnest(missing_skills) as skill
        FROM public.job_matches
        WHERE user_id = user_uuid
        AND created_at > NOW() - INTERVAL '30 days'
        AND array_length(missing_skills, 1) > 0
    LOOP
        -- Get skill details
        SELECT * INTO skill_record
        FROM public.skills
        WHERE name ILIKE missing_skill
        LIMIT 1;
        
        IF skill_record.id IS NOT NULL THEN
            INSERT INTO public.skill_recommendations (
                user_id,
                skill_id,
                reason,
                priority_score,
                market_demand_score,
                estimated_learning_time_hours
            ) VALUES (
                user_uuid,
                skill_record.id,
                'Frequently required in job matches',
                skill_record.demand_score,
                skill_record.demand_score,
                CASE
                    WHEN skill_record.category = 'Programming' THEN 40
                    WHEN skill_record.category = 'Framework' THEN 20
                    ELSE 15
                END
            )
            ON CONFLICT (user_id, skill_id) DO NOTHING;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create notification
CREATE OR REPLACE FUNCTION public.create_notification(
    user_uuid UUID,
    notification_type notification_type,
    title TEXT,
    message TEXT,
    data JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO public.notifications (user_id, type, title, message, data)
    VALUES (user_uuid, notification_type, title, message, data)
    RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log user activity
CREATE OR REPLACE FUNCTION public.log_user_activity(
    user_uuid UUID,
    event_type TEXT,
    event_data JSONB DEFAULT '{}',
    session_id TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.user_analytics (user_id, event_type, event_data, session_id)
    VALUES (user_uuid, event_type, event_data, session_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user dashboard stats
CREATE OR REPLACE FUNCTION public.get_user_dashboard_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_resumes', (
            SELECT COUNT(*) FROM public.resumes WHERE user_id = user_uuid
        ),
        'active_resumes', (
            SELECT COUNT(*) FROM public.resumes WHERE user_id = user_uuid AND status = 'active'
        ),
        'total_matches', (
            SELECT COUNT(*) FROM public.job_matches WHERE user_id = user_uuid
        ),
        'high_score_matches', (
            SELECT COUNT(*) FROM public.job_matches 
            WHERE user_id = user_uuid AND overall_score >= 80
        ),
        'saved_jobs', (
            SELECT COUNT(*) FROM public.saved_jobs WHERE user_id = user_uuid
        ),
        'pending_recommendations', (
            SELECT COUNT(*) FROM public.skill_recommendations 
            WHERE user_id = user_uuid AND NOT is_dismissed
        ),
        'unread_notifications', (
            SELECT COUNT(*) FROM public.notifications 
            WHERE user_id = user_uuid AND NOT is_read
        ),
        'recent_activity_count', (
            SELECT COUNT(*) FROM public.user_analytics 
            WHERE user_id = user_uuid AND created_at > NOW() - INTERVAL '7 days'
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search jobs with filters
CREATE OR REPLACE FUNCTION public.search_jobs(
    search_query TEXT DEFAULT NULL,
    job_location TEXT DEFAULT NULL,
    job_type TEXT DEFAULT NULL,
    experience_level TEXT DEFAULT NULL,
    salary_min INTEGER DEFAULT NULL,
    remote_allowed BOOLEAN DEFAULT NULL,
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    company TEXT,
    location TEXT,
    job_type TEXT,
    experience_level TEXT,
    salary_min INTEGER,
    salary_max INTEGER,
    remote_allowed BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    match_rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        j.id,
        j.title,
        j.company,
        j.location,
        j.job_type,
        j.experience_level,
        j.salary_min,
        j.salary_max,
        j.remote_allowed,
        j.created_at,
        CASE 
            WHEN search_query IS NOT NULL THEN
                ts_rank(to_tsvector('english', j.title || ' ' || j.description), plainto_tsquery('english', search_query))
            ELSE 1.0
        END as match_rank
    FROM public.jobs j
    WHERE j.status = 'active'
        AND (search_query IS NULL OR to_tsvector('english', j.title || ' ' || j.description) @@ plainto_tsquery('english', search_query))
        AND (job_location IS NULL OR j.location ILIKE '%' || job_location || '%')
        AND (job_type IS NULL OR j.job_type = job_type)
        AND (experience_level IS NULL OR j.experience_level = experience_level)
        AND (salary_min IS NULL OR j.salary_max >= salary_min)
        AND (remote_allowed IS NULL OR j.remote_allowed = remote_allowed)
    ORDER BY 
        CASE WHEN search_query IS NOT NULL THEN match_rank ELSE 1 END DESC,
        j.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get skill trends and recommendations
CREATE OR REPLACE FUNCTION public.get_skill_trends()
RETURNS TABLE (
    skill_name TEXT,
    category TEXT,
    popularity_score INTEGER,
    demand_score INTEGER,
    avg_salary_impact DECIMAL,
    growth_trend TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.name,
        s.category,
        s.popularity_score,
        s.demand_score,
        s.avg_salary_impact,
        CASE 
            WHEN s.demand_score >= 80 THEN 'High Growth'
            WHEN s.demand_score >= 60 THEN 'Growing'
            WHEN s.demand_score >= 40 THEN 'Stable'
            ELSE 'Declining'
        END as growth_trend
    FROM public.skills s
    ORDER BY s.demand_score DESC, s.popularity_score DESC
    LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

