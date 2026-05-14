# Quick Setup Script for AstralInsight BA Backend (Windows)
# Run: .\setup.ps1

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  AstralInsight BA - Backend Quick Setup (Windows)          ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "🔍 Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

# Check npm
Write-Host "🔍 Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found" -ForegroundColor Red
    exit 1
}

# Check PostgreSQL
Write-Host "🔍 Checking PostgreSQL..." -ForegroundColor Yellow
try {
    $pgVersion = psql --version
    Write-Host "✅ $pgVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ PostgreSQL not found. Please install PostgreSQL" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install
Write-Host "✅ Dependencies installed" -ForegroundColor Green

# Setup environment
Write-Host ""
Write-Host "🔧 Setting up environment..." -ForegroundColor Yellow
if (!(Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Created .env file" -ForegroundColor Green
    Write-Host "⚠️  IMPORTANT: Edit .env and update DATABASE_URL with your PostgreSQL password" -ForegroundColor Yellow
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

# Database migrations
Write-Host ""
Write-Host "🗄️  Running database migrations..." -ForegroundColor Yellow
npm run prisma:migrate
Write-Host "✅ Migrations applied" -ForegroundColor Green

# Generate Prisma client
Write-Host ""
Write-Host "⚙️  Generating Prisma client..." -ForegroundColor Yellow
npm run prisma:generate
Write-Host "✅ Prisma client generated" -ForegroundColor Green

# Seed data
Write-Host ""
Write-Host "🌱 Seeding database with realistic data..." -ForegroundColor Yellow
npm run seed
Write-Host "✅ Database seeded" -ForegroundColor Green

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║              ✅ Setup Complete!                            ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Start the server:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "📊 Open Prisma Studio:" -ForegroundColor Cyan
Write-Host "   npm run prisma:studio" -ForegroundColor White
Write-Host ""
Write-Host "📡 API will be available at:" -ForegroundColor Cyan
Write-Host "   http://localhost:3001" -ForegroundColor White
Write-Host ""
