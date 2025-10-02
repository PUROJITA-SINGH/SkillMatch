# Better Auth + Supabase Integration Setup Guide

This guide will help you set up Better Auth with your SkillMatch application, ensuring users are visible in your Supabase dashboard.

## 🎯 What We've Built

✅ **Complete Better Auth Integration** with [Better Auth](https://www.better-auth.com/docs/introduction)  
✅ **Supabase Database Sync** - Users appear in your Supabase dashboard  
✅ **Social Authentication** - Google, GitHub, LinkedIn support  
✅ **Modern UI** - Beautiful signup/signin pages with role selection  
✅ **Type Safety** - Full TypeScript integration  
✅ **Security** - Row Level Security (RLS) policies  

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy `env.example` to `.env` and configure:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database Configuration (for Better Auth)
DATABASE_URL=postgresql://postgres:your_password@db.your_project.supabase.co:5432/postgres

# Better Auth OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Better Auth Server Configuration
AUTH_SERVER_PORT=3001
BETTER_AUTH_SECRET=your_random_secret_key_here
```

### 3. Database Setup

Apply the migrations to your Supabase database:

```bash
# If using Supabase CLI
supabase db push

# Or run the SQL files manually in your Supabase dashboard
```

### 4. OAuth Provider Setup

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

#### GitHub OAuth Setup
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL:
   - `http://localhost:3000/api/auth/callback/github` (development)
   - `https://yourdomain.com/api/auth/callback/github` (production)

### 5. Start the Application

```bash
npm run dev
```

This will start both the frontend (port 3000) and the Better Auth server (port 3001).

## 🏗️ Architecture Overview

### Better Auth Integration

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Better Auth     │    │   Supabase      │
│   (React)       │◄──►│   Server         │◄──►│   Database      │
│   Port 3000     │    │   Port 3001      │    │   PostgreSQL    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Key Components

1. **Better Auth Server** (`server/auth-server.ts`)
   - Handles all authentication logic
   - Manages sessions and cookies
   - Processes OAuth flows

2. **Auth Client** (`lib/auth-client.ts`)
   - Frontend interface to Better Auth
   - React hooks and utilities
   - Type-safe authentication methods

3. **Database Sync** (`lib/auth.ts`)
   - Syncs Better Auth users with Supabase
   - Maintains data consistency
   - Handles user profile updates

## 🔐 Authentication Features

### Email/Password Authentication
- ✅ Secure password hashing (bcrypt)
- ✅ Email validation
- ✅ Password strength requirements (8+ characters)
- ✅ Password confirmation
- ✅ Forgot password functionality

### Social Authentication
- ✅ Google OAuth integration
- ✅ GitHub OAuth integration
- ✅ Automatic profile data sync
- ✅ Avatar URL handling

### User Roles
- ✅ Job Seeker role
- ✅ Recruiter role
- ✅ Role-based access control
- ✅ Admin role support

### Security Features
- ✅ JWT token management
- ✅ Secure HTTP-only cookies
- ✅ CSRF protection
- ✅ Rate limiting
- ✅ Session management

## 📊 Supabase Integration

### User Data Sync

When users sign up or sign in through Better Auth, their data is automatically synced to your Supabase `users` table:

```sql
-- Users will appear in this table
SELECT * FROM public.users;
```

### Database Schema

The integration maintains compatibility with your existing Supabase schema:

- **Better Auth** manages authentication (sessions, passwords)
- **Supabase** stores user profiles and application data
- **Automatic sync** keeps both systems in sync

### Viewing Users in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Table Editor**
3. Select the `users` table
4. You'll see all registered users with their profile data

## 🎨 UI Components

### Signup Page Features
- Role selection (Job Seeker/Recruiter)
- Social login buttons
- Form validation
- Loading states
- Error handling
- Success messages

### Login Page Features
- Email/password login
- Social login options
- Forgot password link
- Form validation
- Loading states
- Error handling

### Responsive Design
- Mobile-first approach
- Beautiful animations
- Consistent styling
- Accessibility features

## 🔧 Development Workflow

### Running in Development

```bash
# Start both frontend and auth server
npm run dev

# Or run separately
npm run dev:frontend  # Frontend only
npm run dev:auth     # Auth server only
```

### Testing Authentication

1. **Signup Flow**
   - Visit `http://localhost:3000`
   - Click "Get Started" or "Sign Up"
   - Choose role (Job Seeker/Recruiter)
   - Fill in details and submit
   - Check Supabase dashboard for new user

2. **Login Flow**
   - Use existing credentials
   - Try social login (if configured)
   - Verify session persistence

3. **Profile Management**
   - Update user profile
   - Check sync with Supabase
   - Test role-based features

## 🚨 Troubleshooting

### Common Issues

1. **"Cannot connect to database"**
   - Check `DATABASE_URL` in `.env`
   - Ensure Supabase database is accessible
   - Verify connection string format

2. **OAuth not working**
   - Check client ID/secret configuration
   - Verify redirect URLs match exactly
   - Ensure OAuth apps are properly configured

3. **Users not appearing in Supabase**
   - Check database migrations are applied
   - Verify sync function is working
   - Check Supabase logs for errors

4. **CORS errors**
   - Ensure auth server is running on port 3001
   - Check Vite proxy configuration
   - Verify CORS headers in auth server

### Debug Commands

```bash
# Check if auth server is running
curl http://localhost:3001/api/auth/session

# Test database connection
psql $DATABASE_URL -c "SELECT version();"

# Check Supabase migrations
supabase migration list
```

## 🔄 Data Flow

### User Registration
1. User fills signup form
2. Better Auth validates and creates user
3. Callback function syncs to Supabase
4. User appears in Supabase dashboard
5. Session created and stored

### User Login
1. User submits credentials
2. Better Auth validates
3. Session created
4. Profile data updated in Supabase
5. User redirected to dashboard

### Profile Updates
1. User updates profile in app
2. Better Auth updates its records
3. Sync function updates Supabase
4. Changes visible in dashboard

## 📈 Production Deployment

### Environment Variables
```env
# Production settings
NODE_ENV=production
DATABASE_URL=your_production_database_url
BETTER_AUTH_SECRET=your_production_secret
GOOGLE_CLIENT_ID=your_production_google_client_id
# ... other production configs
```

### Security Considerations
- Use HTTPS in production
- Set secure cookie flags
- Configure proper CORS origins
- Use environment-specific OAuth apps
- Enable rate limiting
- Monitor authentication logs

### Deployment Options
- **Vercel**: Deploy frontend + serverless functions
- **Railway**: Full-stack deployment
- **Docker**: Containerized deployment
- **Traditional VPS**: Manual setup

## 🎉 Success Metrics

After setup, you should have:

✅ **Working Authentication**
- Users can sign up with email/password
- Social login works (Google, GitHub)
- Password reset functionality
- Secure session management

✅ **Supabase Integration**
- Users appear in Supabase dashboard
- Profile data syncs automatically
- Role-based access control works
- Database queries work correctly

✅ **Modern UX**
- Beautiful, responsive UI
- Loading states and error handling
- Form validation and feedback
- Smooth user experience

## 📚 Additional Resources

- [Better Auth Documentation](https://www.better-auth.com/docs/introduction)
- [Supabase Documentation](https://supabase.com/docs)
- [OAuth Setup Guides](https://developers.google.com/identity/protocols/oauth2)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/)

## 🆘 Support

If you encounter issues:

1. Check this guide first
2. Review Better Auth documentation
3. Check Supabase logs
4. Verify environment variables
5. Test database connectivity

---

**🎊 Congratulations!** You now have a production-ready authentication system with Better Auth and Supabase integration!
