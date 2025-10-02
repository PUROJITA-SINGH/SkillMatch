-- Storage Setup for SkillMatch
-- Configure Supabase Storage buckets and policies

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('resumes', 'resumes', false, 10485760, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']),
    ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
    ('company-logos', 'company-logos', true, 1048576, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for resumes bucket
CREATE POLICY "Users can upload their own resumes" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'resumes' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view their own resumes" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'resumes' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update their own resumes" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'resumes' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own resumes" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'resumes' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Recruiters can view resumes for matching" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'resumes' AND
        public.is_recruiter() AND
        EXISTS (
            SELECT 1 FROM public.job_matches jm
            JOIN public.resumes r ON r.id = jm.resume_id
            WHERE r.file_path = name AND r.status = 'active'
        )
    );

-- Storage policies for avatars bucket
CREATE POLICY "Anyone can view avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update their own avatar" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own avatar" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Storage policies for company logos bucket
CREATE POLICY "Anyone can view company logos" ON storage.objects
    FOR SELECT USING (bucket_id = 'company-logos');

CREATE POLICY "Recruiters can upload company logos" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'company-logos' AND
        public.is_recruiter()
    );

CREATE POLICY "Recruiters can update company logos" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'company-logos' AND
        public.is_recruiter()
    );

CREATE POLICY "Recruiters can delete company logos" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'company-logos' AND
        public.is_recruiter()
    );

-- Function to generate secure file paths
CREATE OR REPLACE FUNCTION public.generate_resume_path(
    user_uuid UUID,
    file_name TEXT,
    file_extension TEXT
)
RETURNS TEXT AS $$
BEGIN
    RETURN user_uuid::text || '/' || 
           extract(epoch from now())::bigint || '_' || 
           encode(gen_random_bytes(8), 'hex') || 
           '.' || file_extension;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up orphaned storage files
CREATE OR REPLACE FUNCTION public.cleanup_orphaned_files()
RETURNS INTEGER AS $$
DECLARE
    file_record RECORD;
    deleted_count INTEGER := 0;
BEGIN
    -- Clean up resume files that don't have corresponding database records
    FOR file_record IN
        SELECT name FROM storage.objects 
        WHERE bucket_id = 'resumes'
        AND created_at < NOW() - INTERVAL '1 day'
    LOOP
        IF NOT EXISTS (
            SELECT 1 FROM public.resumes 
            WHERE file_path = file_record.name
        ) THEN
            DELETE FROM storage.objects 
            WHERE bucket_id = 'resumes' AND name = file_record.name;
            deleted_count := deleted_count + 1;
        END IF;
    END LOOP;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get signed URL for resume download
CREATE OR REPLACE FUNCTION public.get_resume_download_url(
    resume_uuid UUID,
    expires_in INTEGER DEFAULT 3600
)
RETURNS TEXT AS $$
DECLARE
    file_path TEXT;
    user_uuid UUID;
BEGIN
    -- Get file path and verify ownership
    SELECT r.file_path, r.user_id INTO file_path, user_uuid
    FROM public.resumes r
    WHERE r.id = resume_uuid;
    
    -- Check if user owns the resume or is a recruiter with access
    IF user_uuid IS NULL THEN
        RAISE EXCEPTION 'Resume not found';
    END IF;
    
    IF auth.uid() != user_uuid AND NOT public.is_recruiter() THEN
        RAISE EXCEPTION 'Access denied';
    END IF;
    
    -- For recruiters, check if they have matching access
    IF auth.uid() != user_uuid THEN
        IF NOT EXISTS (
            SELECT 1 FROM public.job_matches jm
            JOIN public.jobs j ON j.id = jm.job_id
            WHERE jm.resume_id = resume_uuid 
            AND j.recruiter_id = auth.uid()
        ) THEN
            RAISE EXCEPTION 'Access denied - no matching relationship';
        END IF;
    END IF;
    
    -- Return the file path (client will generate signed URL)
    RETURN file_path;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

