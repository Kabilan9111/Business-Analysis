# AstralInsight Analytics Backend Setup Script
# Run this script to set up the FastAPI backend with PostgreSQL

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     AstralInsight Analytics Platform - Backend Setup       ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
Write-Host "Checking Python installation..." -ForegroundColor Yellow
$pythonCheck = python --version 2>&1
if ($pythonCheck -like "Python*") {
    Write-Host "✓ Python found: $pythonCheck" -ForegroundColor Green
} else {
    Write-Host "✗ Python not found. Please install Python 3.9+" -ForegroundColor Red
    Exit
}

# Navigate to backend directory
cd backend

# Create virtual environment
Write-Host ""
Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
python -m venv venv
Write-Host "✓ Virtual environment created" -ForegroundColor Green

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1
Write-Host "✓ Virtual environment activated" -ForegroundColor Green

# Install dependencies
Write-Host ""
Write-Host "Installing dependencies (this may take a few minutes)..." -ForegroundColor Yellow
pip install -r requirements.txt --quiet
Write-Host "✓ Dependencies installed" -ForegroundColor Green

# Create uploads directory
Write-Host ""
Write-Host "Setting up directories..." -ForegroundColor Yellow
if (-Not (Test-Path "uploads")) {
    New-Item -ItemType Directory -Path "uploads" -Force | Out-Null
}
Write-Host "✓ Uploads directory created" -ForegroundColor Green

# Display next steps
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║              Setup Complete! Next Steps:                   ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Ensure PostgreSQL is installed and running" -ForegroundColor White
Write-Host "   - Download from: https://www.postgresql.org/download/" -ForegroundColor Gray
Write-Host "   - Default port: 5432" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Create PostgreSQL database:" -ForegroundColor White
Write-Host "   psql -U postgres" -ForegroundColor Yellow
Write-Host "   CREATE DATABASE astral_insight;" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Update .env file with your database credentials:" -ForegroundColor White
Write-Host "   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/astral_insight" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. Start the backend server:" -ForegroundColor White
Write-Host "   python -m uvicorn app.main:app --reload" -ForegroundColor Yellow
Write-Host ""
Write-Host "5. Access API documentation:" -ForegroundColor White
Write-Host "   http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host ""
Write-Host "Happy forecasting! 🚀" -ForegroundColor Green
Write-Host ""
