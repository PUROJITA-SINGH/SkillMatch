#!/bin/bash

# SkillMatch Backend Setup Script
# This script helps set up the Supabase backend for SkillMatch

set -e

echo "🚀 SkillMatch Backend Setup"
echo "=========================="

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
    echo "✅ Supabase CLI installed"
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your Supabase credentials before continuing"
    echo "   You can find these in your Supabase project dashboard:"
    echo "   - Project URL: https://app.supabase.com/project/[your-project]/settings/api"
    echo "   - Anon Key: Same page as above"
    read -p "Press Enter when you've updated the .env file..."
fi

# Source environment variables
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check if required environment variables are set
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo "❌ Missing required environment variables in .env file"
    echo "   Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY"
    exit 1
fi

echo "✅ Environment variables configured"

# Initialize Supabase project
echo "🔧 Initializing Supabase project..."
if [ ! -f "supabase/config.toml" ]; then
    supabase init
fi

# Link to remote project if PROJECT_REF is provided
if [ ! -z "$SUPABASE_PROJECT_REF" ]; then
    echo "🔗 Linking to remote Supabase project..."
    supabase link --project-ref $SUPABASE_PROJECT_REF
else
    echo "⚠️  SUPABASE_PROJECT_REF not set. You can link manually later with:"
    echo "   supabase link --project-ref your-project-ref"
fi

# Start local Supabase (optional)
read -p "🤔 Do you want to start Supabase locally for development? (y/N): " start_local
if [[ $start_local =~ ^[Yy]$ ]]; then
    echo "🏃 Starting local Supabase..."
    supabase start
    echo "✅ Local Supabase started"
    echo "📊 Dashboard: http://localhost:54323"
    echo "🔌 API URL: http://localhost:54321"
    LOCAL_SETUP=true
else
    LOCAL_SETUP=false
fi

# Apply database migrations
echo "📊 Applying database migrations..."
if [ "$LOCAL_SETUP" = true ]; then
    supabase db push --local
else
    read -p "🤔 Apply migrations to remote database? (y/N): " apply_remote
    if [[ $apply_remote =~ ^[Yy]$ ]]; then
        supabase db push
    fi
fi

# Seed database with initial data
read -p "🌱 Do you want to seed the database with initial data? (y/N): " seed_db
if [[ $seed_db =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding database..."
    if [ "$LOCAL_SETUP" = true ]; then
        supabase db reset --seed
    else
        # For remote, we need to run the seed file manually
        echo "⚠️  For remote database, please run the seed.sql file manually in your Supabase dashboard"
        echo "   SQL Editor > New Query > Copy contents of supabase/seed.sql"
    fi
fi

# Generate TypeScript types
echo "🔧 Generating TypeScript types..."
if [ "$LOCAL_SETUP" = true ]; then
    supabase gen types typescript --local > types/database.ts
else
    if [ ! -z "$SUPABASE_PROJECT_REF" ]; then
        supabase gen types typescript --project-id $SUPABASE_PROJECT_REF > types/database.ts
    else
        echo "⚠️  Cannot generate types without PROJECT_REF. Generate manually with:"
        echo "   supabase gen types typescript --project-id your-project-ref > types/database.ts"
    fi
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🎉 Backend setup complete!"
echo "========================"
echo ""
echo "📋 Next Steps:"
echo "1. 🔐 Configure OAuth providers in Supabase Dashboard > Authentication > Providers"
echo "2. 📧 Set up email templates in Supabase Dashboard > Authentication > Email Templates"
echo "3. 🗂️ Configure storage buckets in Supabase Dashboard > Storage"
echo "4. 🚀 Start your frontend development server: npm run dev"
echo ""

if [ "$LOCAL_SETUP" = true ]; then
    echo "🔗 Local Development URLs:"
    echo "   Dashboard: http://localhost:54323"
    echo "   API: http://localhost:54321"
    echo "   DB: postgresql://postgres:postgres@localhost:54322/postgres"
    echo ""
fi

echo "📚 Documentation:"
echo "   Backend Setup: ./BACKEND_README.md"
echo "   Supabase Docs: https://supabase.com/docs"
echo ""
echo "Happy coding! 🚀"

