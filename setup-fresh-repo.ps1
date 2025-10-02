# Fresh Repository Setup Script for SkillMatch
# This script will prepare your files for a brand new GitHub repository

Write-Host "🚀 Setting up fresh SkillMatch repository..." -ForegroundColor Green

# Step 1: Remove current Git history
Write-Host "1. Removing old Git history..." -ForegroundColor Yellow
Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue

# Step 2: Initialize fresh Git repository
Write-Host "2. Initializing fresh Git repository..." -ForegroundColor Yellow
git init

# Step 3: Set main as default branch
Write-Host "3. Setting main as default branch..." -ForegroundColor Yellow
git branch -M main

# Step 4: Add all files
Write-Host "4. Adding all project files..." -ForegroundColor Yellow
git add .

# Step 5: Create initial commit
Write-Host "5. Creating initial commit..." -ForegroundColor Yellow
git commit -m "🎉 Initial commit: SkillMatch - AI-powered job matching platform

✨ Features:
- Better Auth integration with social login
- Supabase PostgreSQL database with real-time features  
- React + TypeScript frontend with Tailwind CSS
- AI-powered resume parsing and job matching
- Role-based access (Job Seekers & Recruiters)
- Professional UI with responsive design
- Production-ready authentication and security

🛠️ Tech Stack:
- Frontend: React 19, TypeScript, Tailwind CSS, Vite
- Backend: Supabase, Better Auth, PostgreSQL
- AI: Google Gemini API for intelligent matching
- Auth: JWT tokens, OAuth (Google, GitHub), secure sessions
- Database: Row Level Security, real-time subscriptions

🚀 Ready for production deployment!"

Write-Host "✅ Fresh repository setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Delete your old GitHub repository (if desired)" -ForegroundColor White
Write-Host "2. Create a new repository on GitHub" -ForegroundColor White
Write-Host "3. Run: git remote add origin https://github.com/PUROJITA-SINGH/NEW_REPO_NAME.git" -ForegroundColor White
Write-Host "4. Run: git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Your SkillMatch app is ready for a fresh start!" -ForegroundColor Green
