# SkillMatch Backend - Supabase Setup Guide

This document provides a comprehensive guide to set up the Supabase backend for the SkillMatch application.

## 🏗️ Architecture Overview

The SkillMatch backend is built on Supabase, providing:

- **Authentication**: Multi-provider auth (email, Google, GitHub, LinkedIn)
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Storage**: File storage for resumes and avatars
- **Real-time**: Live updates for notifications and matches
- **Edge Functions**: Serverless functions for AI processing

## 📊 Database Schema

### Core Tables

1. **users** - User profiles and authentication data
2. **skills** - Skills catalog with market data
3. **user_skills** - User skill associations with proficiency levels
4. **resumes** - Resume metadata and parsed content
5. **jobs** - Job postings with requirements
6. **job_matches** - AI-generated job-resume matches
7. **skill_recommendations** - Personalized skill suggestions
8. **notifications** - User notifications system
9. **user_analytics** - Activity tracking and analytics
10. **feedback** - User feedback and ratings
11. **saved_jobs** - User's saved job postings
12. **job_applications** - Application tracking

### Storage Buckets

- **resumes** - PDF/DOC resume files (private)
- **avatars** - User profile pictures (public)
- **company-logos** - Company logo images (public)

## 🚀 Quick Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Environment Configuration

Copy `env.example` to `.env` and fill in your Supabase credentials:

```bash
cp env.example .env
```

Required variables:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Initialize Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref
```

### 4. Run Database Migrations

```bash
# Apply all migrations
supabase db push

# Or apply them individually
supabase migration up
```

### 5. Seed Initial Data

```bash
# Run seed script
supabase db reset --seed
```

## 🔧 Detailed Setup

### Database Migration Files

The backend includes these migration files:

1. **001_initial_schema.sql** - Core tables, indexes, and constraints
2. **002_rls_policies.sql** - Row Level Security policies
3. **003_functions_triggers.sql** - Database functions and triggers
4. **004_storage_setup.sql** - Storage buckets and policies

### Key Database Functions

- `handle_new_user()` - Automatically creates user profile on signup
- `calculate_match_score()` - Computes job-resume compatibility
- `generate_skill_recommendations()` - Creates personalized skill suggestions
- `search_jobs()` - Advanced job search with filters
- `get_user_dashboard_stats()` - Dashboard analytics
- `cleanup_orphaned_files()` - Storage maintenance

### Row Level Security (RLS)

All tables have RLS enabled with policies ensuring:

- Users can only access their own data
- Recruiters can view resumes only through job matches
- Admins have full access for management
- Public data (skills, active jobs) is accessible to authenticated users

## 🔐 Authentication Setup

### Email Authentication

Enabled by default with email confirmation optional.

### OAuth Providers

Configure in Supabase Dashboard > Authentication > Providers:

#### Google OAuth
1. Create Google OAuth app in Google Cloud Console
2. Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
3. Add client ID and secret to Supabase

#### GitHub OAuth
1. Create GitHub OAuth app in GitHub Settings
2. Set authorization callback URL: `https://your-project.supabase.co/auth/v1/callback`
3. Add client ID and secret to Supabase

#### LinkedIn OAuth
1. Create LinkedIn app in LinkedIn Developer Portal
2. Add redirect URL: `https://your-project.supabase.co/auth/v1/callback`
3. Add client ID and secret to Supabase

## 📁 Storage Configuration

### Bucket Policies

- **resumes**: Private bucket with user-specific access
- **avatars**: Public bucket for profile pictures
- **company-logos**: Public bucket for company branding

### File Upload Limits

- Resumes: 10MB (PDF, DOC, DOCX, TXT)
- Avatars: 2MB (JPEG, PNG, WebP, GIF)
- Company Logos: 1MB (JPEG, PNG, WebP, SVG)

## 🔄 Real-time Features

### Subscriptions Available

- **Notifications**: Live notification updates
- **Job Matches**: Real-time match results
- **Job Applications**: Application status changes

### Usage Example

```typescript
import { realtime } from './lib/supabase'

// Subscribe to notifications
const channel = realtime.subscribeToNotifications(userId, (payload) => {
  console.log('New notification:', payload)
})

// Unsubscribe when component unmounts
realtime.unsubscribe(channel)
```

## 🧪 Development Workflow

### Local Development

```bash
# Start Supabase locally
supabase start

# Apply migrations
supabase db push

# Generate TypeScript types
supabase gen types typescript --local > types/database.ts
```

### Database Changes

1. Create new migration:
```bash
supabase migration new your_migration_name
```

2. Write SQL in the generated file
3. Apply migration:
```bash
supabase db push
```

4. Update TypeScript types:
```bash
supabase gen types typescript --local > types/database.ts
```

## 📈 Performance Optimization

### Indexes

The schema includes optimized indexes for:

- User lookups by role and creation date
- Job searches by status, location, and company
- Match queries by user and score
- Full-text search on jobs and skills

### Query Optimization

- Use `select()` to limit returned columns
- Implement pagination with `range()`
- Use RPC functions for complex queries
- Cache frequently accessed data

## 🔍 Monitoring and Analytics

### Built-in Analytics

- User activity tracking in `user_analytics` table
- Performance metrics via database functions
- Error logging through Supabase dashboard

### Custom Analytics

```typescript
import { db } from './lib/supabase'

// Log user activity
await db.logUserActivity(userId, 'resume_upload', {
  fileName: 'resume.pdf',
  fileSize: 1024000
})
```

## 🛡️ Security Best Practices

### Data Protection

- All sensitive data encrypted at rest
- RLS policies prevent unauthorized access
- Input validation in database functions
- Secure file upload with type validation

### API Security

- JWT token validation
- Rate limiting via Supabase
- CORS configuration
- Environment variable protection

## 🚨 Troubleshooting

### Common Issues

1. **Migration Errors**
   - Check for syntax errors in SQL
   - Ensure proper foreign key relationships
   - Verify RLS policies don't conflict

2. **Authentication Issues**
   - Verify OAuth app configurations
   - Check redirect URLs match exactly
   - Ensure environment variables are set

3. **Storage Problems**
   - Check bucket policies
   - Verify file size limits
   - Ensure proper MIME type restrictions

### Debug Commands

```bash
# Check migration status
supabase migration list

# View database logs
supabase logs db

# Reset database (caution: deletes all data)
supabase db reset
```

## 📚 API Reference

### Database Helper Functions

The `lib/supabase.ts` file provides convenient helpers:

```typescript
import { db } from './lib/supabase'

// User operations
const profile = await db.getUserProfile(userId)
await db.updateUserProfile(userId, { full_name: 'John Doe' })

// Resume operations
const resumes = await db.getResumes(userId)
const resume = await db.createResume(resumeData)

// Job operations
const jobs = await db.getJobs({ location: 'San Francisco' })
const matches = await db.getJobMatches(userId)

// Skill operations
const skills = await db.getSkills()
const recommendations = await db.getSkillRecommendations(userId)
```

## 🔄 Deployment

### Production Setup

1. **Environment Variables**
   - Set production Supabase URL and keys
   - Configure OAuth providers for production domain
   - Set up SMTP for email notifications

2. **Database Configuration**
   - Review and optimize RLS policies
   - Set up database backups
   - Configure connection pooling

3. **Storage Configuration**
   - Set up CDN for public assets
   - Configure backup policies
   - Implement file cleanup jobs

### CI/CD Pipeline

```yaml
# Example GitHub Actions workflow
name: Deploy Backend
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Supabase CLI
        run: npm install -g supabase
      - name: Deploy migrations
        run: supabase db push --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
```

## 📞 Support

For issues and questions:

1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Review the troubleshooting section above
3. Check database logs in Supabase dashboard
4. Create an issue in the project repository

## 🔄 Updates and Maintenance

### Regular Tasks

- Monitor database performance
- Review and update RLS policies
- Clean up orphaned files
- Update skill data and market trends
- Backup critical data

### Version Updates

- Keep Supabase CLI updated
- Monitor for Supabase platform updates
- Update TypeScript types after schema changes
- Test migrations in staging environment

---

This backend setup provides a robust, scalable foundation for the SkillMatch application with enterprise-grade security, performance, and developer experience.

