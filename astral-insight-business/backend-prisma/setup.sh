#!/bin/bash
# Quick Setup Script for AstralInsight BA Backend
# Run: bash setup.sh

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  AstralInsight BA - Backend Quick Setup                   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check Node.js
echo "🔍 Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi
NODE_VERSION=$(node -v)
echo "✅ Node.js $NODE_VERSION"

# Check npm
echo "🔍 Checking npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found"
    exit 1
fi
echo "✅ npm $(npm -v)"

# Check PostgreSQL
echo "🔍 Checking PostgreSQL..."
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL not found. Please install PostgreSQL"
    exit 1
fi
echo "✅ PostgreSQL $(psql --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Setup environment
echo ""
echo "🔧 Setting up environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file"
    echo "⚠️  IMPORTANT: Edit .env and update DATABASE_URL with your PostgreSQL password"
else
    echo "✅ .env file already exists"
fi

# Database migrations
echo ""
echo "🗄️  Running database migrations..."
npm run prisma:migrate

# Generate Prisma client
echo ""
echo "⚙️  Generating Prisma client..."
npm run prisma:generate

# Seed data
echo ""
echo "🌱 Seeding database with realistic data..."
npm run seed

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              ✅ Setup Complete!                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "🚀 Start the server:"
echo "   npm run dev"
echo ""
echo "📊 Open Prisma Studio:"
echo "   npm run prisma:studio"
echo ""
echo "📡 API will be available at:"
echo "   http://localhost:3001"
echo ""
