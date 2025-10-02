-- Better Auth Integration with Supabase
-- This migration ensures Better Auth tables work with our existing Supabase setup

-- Better Auth will create its own user and session tables
-- We need to ensure they integrate properly with our existing users table

-- Create Better Auth tables (these will be created by Better Auth automatically)
-- But we'll add some custom triggers to sync with our users table

-- Function to sync Better Auth user with our users table
CREATE OR REPLACE FUNCTION sync_better_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update user in our users table when Better Auth user is created/updated
  INSERT INTO public.users (
    id,
    email,
    full_name,
    role,
    avatar_url,
    phone,
    location,
    bio,
    linkedin_url,
    github_url,
    portfolio_url,
    years_experience,
    current_position,
    current_company,
    is_verified,
    subscription_tier,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.name, NEW.full_name),
    COALESCE(NEW.role, 'job_seeker'),
    NEW.avatar_url,
    NEW.phone,
    NEW.location,
    NEW.bio,
    NEW.linkedin_url,
    NEW.github_url,
    NEW.portfolio_url,
    COALESCE(NEW.years_experience, 0),
    NEW.current_position,
    NEW.current_company,
    COALESCE(NEW.is_verified, false),
    COALESCE(NEW.subscription_tier, 'free'),
    COALESCE(NEW.created_at, NOW()),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, users.full_name),
    role = COALESCE(EXCLUDED.role, users.role),
    avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
    phone = COALESCE(EXCLUDED.phone, users.phone),
    location = COALESCE(EXCLUDED.location, users.location),
    bio = COALESCE(EXCLUDED.bio, users.bio),
    linkedin_url = COALESCE(EXCLUDED.linkedin_url, users.linkedin_url),
    github_url = COALESCE(EXCLUDED.github_url, users.github_url),
    portfolio_url = COALESCE(EXCLUDED.portfolio_url, users.portfolio_url),
    years_experience = COALESCE(EXCLUDED.years_experience, users.years_experience),
    current_position = COALESCE(EXCLUDED.current_position, users.current_position),
    current_company = COALESCE(EXCLUDED.current_company, users.current_company),
    is_verified = COALESCE(EXCLUDED.is_verified, users.is_verified),
    subscription_tier = COALESCE(EXCLUDED.subscription_tier, users.subscription_tier),
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: The actual trigger will be created after Better Auth creates its tables
-- This is handled in the Better Auth configuration callbacks

-- Create a view for Better Auth compatibility
CREATE OR REPLACE VIEW better_auth_users AS
SELECT 
  id,
  email,
  full_name as name,
  role,
  avatar_url,
  phone,
  location,
  bio,
  linkedin_url,
  github_url,
  portfolio_url,
  years_experience,
  current_position,
  current_company,
  is_verified,
  subscription_tier,
  created_at,
  updated_at
FROM public.users;

-- Grant permissions for Better Auth
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO authenticated;
GRANT SELECT ON better_auth_users TO authenticated;

-- Function to get user profile for Better Auth
CREATE OR REPLACE FUNCTION get_user_profile_for_auth(user_id UUID)
RETURNS JSON AS $$
DECLARE
  user_profile JSON;
BEGIN
  SELECT to_json(u.*) INTO user_profile
  FROM public.users u
  WHERE u.id = user_id;
  
  RETURN user_profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user profile from Better Auth
CREATE OR REPLACE FUNCTION update_user_profile_from_auth(
  user_id UUID,
  user_data JSON
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.users SET
    full_name = COALESCE((user_data->>'name'), (user_data->>'full_name'), full_name),
    role = COALESCE((user_data->>'role'), role),
    avatar_url = COALESCE((user_data->>'avatar_url'), avatar_url),
    phone = COALESCE((user_data->>'phone'), phone),
    location = COALESCE((user_data->>'location'), location),
    bio = COALESCE((user_data->>'bio'), bio),
    linkedin_url = COALESCE((user_data->>'linkedin_url'), linkedin_url),
    github_url = COALESCE((user_data->>'github_url'), github_url),
    portfolio_url = COALESCE((user_data->>'portfolio_url'), portfolio_url),
    years_experience = COALESCE((user_data->>'years_experience')::INTEGER, years_experience),
    current_position = COALESCE((user_data->>'current_position'), current_position),
    current_company = COALESCE((user_data->>'current_company'), current_company),
    is_verified = COALESCE((user_data->>'is_verified')::BOOLEAN, is_verified),
    subscription_tier = COALESCE((user_data->>'subscription_tier'), subscription_tier),
    updated_at = NOW()
  WHERE id = user_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for Better Auth performance
CREATE INDEX IF NOT EXISTS idx_users_email_auth ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role_auth ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at_auth ON public.users(created_at);

-- Ensure RLS policies work with Better Auth
-- The existing RLS policies should work, but we'll add some specific ones for Better Auth

-- Policy for Better Auth to access user data
CREATE POLICY "Better Auth can access user data" ON public.users
  FOR ALL 
  USING (true) -- Better Auth will handle its own authentication
  WITH CHECK (true);

-- Note: In production, you might want to restrict this policy to specific service accounts
