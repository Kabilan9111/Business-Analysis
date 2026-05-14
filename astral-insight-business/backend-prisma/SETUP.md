# AstralInsight BA - Backend Setup Guide

## 📋 Prerequisites

### System Requirements
- **Node.js**: v18+ (LTS recommended)
- **PostgreSQL**: v13+ (with psql client)
- **npm**: v9+ or yarn

### Verify Installation
```bash
node --version       # Should be v18+
npm --version        # Should be v9+
psql --version       # Should be v13+
```

---

## 🗄️ PostgreSQL Setup

### Windows Installation

1. **Download PostgreSQL**
   - Visit: https://www.postgresql.org/download/windows/
   - Download PostgreSQL 15+ installer

2. **Install PostgreSQL**
   - Run installer
   - Set password for `postgres` user (remember this!)
   - Keep default port: 5432
   - Complete installation

3. **Verify Installation**
   ```bash
   psql --version
   psql -U postgres -h localhost
   ```

### Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Inside psql:
CREATE DATABASE astral_insight_ba;
\q
```

---

## 📂 Backend Setup

### 1. Navigate to Backend Directory

```bash
cd "F:\Business Analysis\astral-insight-business\backend-prisma"
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web framework
- `@prisma/client` - ORM
- `typescript` - Type safety
- `tsx` - TypeScript runner
- `@faker-js/faker` - Data generation
- And other utilities

**Expected time**: 2-5 minutes depending on internet speed

### 3. Configure Environment

```bash
# Copy example to actual file
cp .env.example .env
```

**Edit `.env` file:**
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/astral_insight_ba"
NODE_ENV="development"
PORT=3001
```

Replace `YOUR_PASSWORD` with the PostgreSQL password you set during installation.

### 4. Setup Database Schema

```bash
npm run prisma:migrate
```

This will:
- Create all tables
- Set up indexes
- Configure relationships

**Expected output:**
```
✓ Created migration: YYYYMMDDHHMMSS_init
✓ Migration applied
```

### 5. Generate Prisma Client

```bash
npm run prisma:generate
```

### 6. Seed Realistic Data

```bash
npm run seed
```

**What gets seeded:**
- ✅ 42 Indian enterprise customers (with all mandatory names)
- ✅ 10 SaaS/API products
- ✅ 50,000 realistic transactions
- ✅ 300 forecast predictions
- ✅ 8 AI-generated insights
- ✅ 8 risk alerts
- ✅ 1,000+ user activities
- ✅ Regional & product performance

**Expected time**: 2-5 minutes (shows progress bar)

**Expected output:**
```
🌱 Starting comprehensive database seed...
🗑️  Clearing existing data...
✅ Database cleared
📦 Creating 10 enterprise products...
✅ Created 10 products
👥 Creating 42 Indian enterprise customers...
✅ Created 42 customers
📊 Generating 50,000 enterprise transactions...
✅ Created 50000 orders
🔮 Creating 30-day forecast predictions...
✅ Created 300 forecast records
💡 Generating AI revenue insights...
✅ Created 8 insights
⚠️ Creating risk detection alerts...
✅ Created 8 risk alerts
📈 Computing regional performance metrics...
✅ Regional metrics computed
📊 Computing product performance analytics...
✅ Product performance computed
🔔 Creating user activity logs...
✅ Created 1000 activity records

🎉 SEED COMPLETED SUCCESSFULLY!
```

---

## 🚀 Start Development Server

```bash
npm run dev
```

**Expected output:**
```
╔════════════════════════════════════════════════════════════╗
║         AstralInsight BA - Analytics API Server           ║
╚════════════════════════════════════════════════════════════╝

✅ Database connected successfully

🚀 Server running on http://localhost:3001

📊 Available Endpoints:
   • GET /api/kpis
   • GET /api/revenue-trend
   • GET /api/top-products
   • GET /api/customers
   • GET /api/orders
   • GET /api/forecast
   • GET /api/regions
   • GET /api/risk-alerts
   • GET /api/ai-insights
   • GET /api/channels
   • GET /api/customer-segmentation

🔗 Root: http://localhost:3001/
```

---

## ✅ Verify Setup

### Test the API

**In your browser or REST client:**

1. **Check if server is running**
   ```
   GET http://localhost:3001
   ```
   Should return API overview

2. **Get Dashboard KPIs**
   ```
   GET http://localhost:3001/api/kpis
   ```
   Should return all metrics from database

3. **Get Revenue Trend**
   ```
   GET http://localhost:3001/api/revenue-trend
   ```
   Should return 30-day trend data

4. **Get Top Products**
   ```
   GET http://localhost:3001/api/top-products
   ```
   Should return 5 top products with real revenue

### View Data in Prisma Studio

```bash
npm run prisma:studio
```

This opens a visual database browser at `http://localhost:5555` where you can:
- View all tables
- See relationships
- Edit records
- Run queries

---

## 🔄 Common Commands

```bash
# Development
npm run dev                    # Start with hot reload

# Database
npm run prisma:migrate         # Apply migrations
npm run prisma:generate        # Generate Prisma client
npm run seed                   # Re-seed data
npm run prisma:studio          # Open database UI

# Build & Run
npm run build                  # Compile TypeScript
npm start                      # Run compiled version

# All-in-one setup
npm run setup                  # Install + migrate + seed
```

---

## 📊 API Examples

### Using curl
```bash
# Get KPIs
curl http://localhost:3001/api/kpis

# Get 30-day forecast
curl http://localhost:3001/api/forecast?days=30

# Get top 10 products
curl http://localhost:3001/api/top-products?limit=10
```

### Using fetch (JavaScript)
```javascript
const response = await fetch('http://localhost:3001/api/kpis');
const data = await response.json();
console.log(data);
```

### Using Postman
1. Import this as a new request:
   - Method: `GET`
   - URL: `http://localhost:3001/api/kpis`
   - Click Send

---

## 🐛 Troubleshooting

### "Cannot find module '@prisma/client'"
```bash
npm install
npm run prisma:generate
```

### "PostgreSQL connection failed"
- Check if PostgreSQL is running
- Verify DATABASE_URL in .env
- Test connection: `psql -U postgres -h localhost`

### "EADDRINUSE: address already in use :::3001"
```bash
# Port 3001 is already in use
# Option 1: Kill the process
lsof -ti:3001 | xargs kill -9

# Option 2: Use different port
PORT=3002 npm run dev
```

### "Migration lock"
```bash
npm run prisma:migrate reset
npm run seed
```

### Database shows no data
```bash
npm run seed
```

---

## 🔐 Security Notes (Before Production)

- ✅ Use strong PostgreSQL passwords
- ✅ Never commit `.env` file
- ✅ Use environment-specific configs
- ✅ Enable PostgreSQL SSL for production
- ✅ Implement authentication middleware
- ✅ Add rate limiting
- ✅ Validate all inputs
- ✅ Use HTTPS in production

---

## 📈 Next Steps

1. **Connect Frontend to Backend**
   ```javascript
   // In React component
   const API_BASE = 'http://localhost:3001/api';
   const response = await fetch(`${API_BASE}/kpis`);
   ```

2. **Add Authentication**
   - Implement JWT tokens
   - Add user roles

3. **Deploy Backend**
   - Use Railway, Render, or Heroku
   - Configure PostgreSQL cloud hosting
   - Set up CI/CD pipeline

4. **Monitor & Scale**
   - Add logging (Winston, Pino)
   - Set up monitoring (DataDog, New Relic)
   - Implement caching (Redis)
   - Add database backups

---

## 📞 Support

If you encounter issues:

1. **Check logs**
   ```bash
   npm run dev
   # Look for error messages
   ```

2. **Verify database**
   ```bash
   npm run prisma:studio
   # Browse data visually
   ```

3. **Test API**
   ```bash
   curl http://localhost:3001
   # Should return API overview
   ```

---

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Setup Complete! Your enterprise analytics backend is ready! 🎉**
