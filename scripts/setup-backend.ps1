# SkillMatch Backend Setup Script (PowerShell)
# This script helps set up the Supabase backend for SkillMatch

Write-Host "🚀 SkillMatch Backend Setup" -ForegroundColor Green
Write-Host "==========================" -ForegroundColor Green

# Check if Supabase CLI is installed
try {
    supabase --version | Out-Null
    Write-Host "✅ Supabase CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI not found. Installing..." -ForegroundColor Red
    npm install -g supabase
    Write-Host "✅ Supabase CLI installed" -ForegroundColor Green
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item "env.example" ".env"
    Write-Host "⚠️  Please edit .env file with your Supabase credentials before continuing" -ForegroundColor Yellow
    Write-Host "   You can find these in your Supabase project dashboard:" -ForegroundColor Yellow
    Write-Host "   - Project URL: https://app.supabase.com/project/[your-project]/settings/api" -ForegroundColor Yellow
    Write-Host "   - Anon Key: Same page as above" -ForegroundColor Yellow
    Read-Host "Press Enter when you've updated the .env file"
}

# Load environment variables
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match "^([^#][^=]+)=(.*)$") {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
}

# Check if required environment variables are set
$supabaseUrl = [Environment]::GetEnvironmentVariable("VITE_SUPABASE_URL", "Process")
$supabaseKey = [Environment]::GetEnvironmentVariable("VITE_SUPABASE_ANON_KEY", "Process")

if (-not $supabaseUrl -or -not $supabaseKey) {
    Write-Host "❌ Missing required environment variables in .env file" -ForegroundColor Red
    Write-Host "   Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Environment variables configured" -ForegroundColor Green

# Initialize Supabase project
Write-Host "🔧 Initializing Supabase project..." -ForegroundColor Blue
if (-not (Test-Path "supabase/config.toml")) {
    supabase init
}

# Link to remote project if PROJECT_REF is provided
$projectRef = [Environment]::GetEnvironmentVariable("SUPABASE_PROJECT_REF", "Process")
if ($projectRef) {
    Write-Host "🔗 Linking to remote Supabase project..." -ForegroundColor Blue
    supabase link --project-ref $projectRef
} else {
    Write-Host "⚠️  SUPABASE_PROJECT_REF not set. You can link manually later with:" -ForegroundColor Yellow
    Write-Host "   supabase link --project-ref your-project-ref" -ForegroundColor Yellow
}

# Start local Supabase (optional)
$startLocal = Read-Host "🤔 Do you want to start Supabase locally for development? (y/N)"
$localSetup = $false
if ($startLocal -match "^[Yy]$") {
    Write-Host "🏃 Starting local Supabase..." -ForegroundColor Blue
    supabase start
    Write-Host "✅ Local Supabase started" -ForegroundColor Green
    Write-Host "📊 Dashboard: http://localhost:54323" -ForegroundColor Cyan
    Write-Host "🔌 API URL: http://localhost:54321" -ForegroundColor Cyan
    $localSetup = $true
}

# Apply database migrations
Write-Host "📊 Applying database migrations..." -ForegroundColor Blue
if ($localSetup) {
    supabase db push --local
} else {
    $applyRemote = Read-Host "🤔 Apply migrations to remote database? (y/N)"
    if ($applyRemote -match "^[Yy]$") {
        supabase db push
    }
}

# Seed database with initial data
$seedDb = Read-Host "🌱 Do you want to seed the database with initial data? (y/N)"
if ($seedDb -match "^[Yy]$") {
    Write-Host "🌱 Seeding database..." -ForegroundColor Blue
    if ($localSetup) {
        supabase db reset --seed
    } else {
        Write-Host "⚠️  For remote database, please run the seed.sql file manually in your Supabase dashboard" -ForegroundColor Yellow
        Write-Host "   SQL Editor > New Query > Copy contents of supabase/seed.sql" -ForegroundColor Yellow
    }
}

# Generate TypeScript types
Write-Host "🔧 Generating TypeScript types..." -ForegroundColor Blue
if ($localSetup) {
    supabase gen types typescript --local | Out-File -FilePath "types/database.ts" -Encoding UTF8
} else {
    if ($projectRef) {
        supabase gen types typescript --project-id $projectRef | Out-File -FilePath "types/database.ts" -Encoding UTF8
    } else {
        Write-Host "⚠️  Cannot generate types without PROJECT_REF. Generate manually with:" -ForegroundColor Yellow
        Write-Host "   supabase gen types typescript --project-id your-project-ref > types/database.ts" -ForegroundColor Yellow
    }
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
npm install

Write-Host ""
Write-Host "🎉 Backend setup complete!" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. 🔐 Configure OAuth providers in Supabase Dashboard > Authentication > Providers" -ForegroundColor White
Write-Host "2. 📧 Set up email templates in Supabase Dashboard > Authentication > Email Templates" -ForegroundColor White
Write-Host "3. 🗂️ Configure storage buckets in Supabase Dashboard > Storage" -ForegroundColor White
Write-Host "4. 🚀 Start your frontend development server: npm run dev" -ForegroundColor White
Write-Host ""

if ($localSetup) {
    Write-Host "🔗 Local Development URLs:" -ForegroundColor Cyan
    Write-Host "   Dashboard: http://localhost:54323" -ForegroundColor White
    Write-Host "   API: http://localhost:54321" -ForegroundColor White
    Write-Host "   DB: postgresql://postgres:postgres@localhost:54322/postgres" -ForegroundColor White
    Write-Host ""
}

Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   Backend Setup: ./BACKEND_README.md" -ForegroundColor White
Write-Host "   Supabase Docs: https://supabase.com/docs" -ForegroundColor White
Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Green

