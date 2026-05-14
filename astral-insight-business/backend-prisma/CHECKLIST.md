# 🚀 AstralInsight BA Backend - Quick Start Checklist

## Phase 1: Prerequisites (5 minutes)

- [ ] **Node.js v18+**
  ```bash
  node --version
  ```
  - If not installed: https://nodejs.org/

- [ ] **PostgreSQL 13+**
  ```bash
  psql --version
  ```
  - If not installed: https://www.postgresql.org/download/

- [ ] **npm v9+**
  ```bash
  npm --version
  ```

## Phase 2: Database Setup (5 minutes)

- [ ] **Create PostgreSQL Database**
  ```bash
  psql -U postgres
  CREATE DATABASE astral_insight_ba;
  \q
  ```

- [ ] **Remember your PostgreSQL password** (set during PostgreSQL installation)

## Phase 3: Backend Configuration (3 minutes)

- [ ] **Navigate to backend directory**
  ```bash
  cd "F:\Business Analysis\astral-insight-business\backend-prisma"
  ```

- [ ] **Copy environment file**
  ```bash
  cp .env.example .env
  ```

- [ ] **Edit .env file with your database password**
  ```
  DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/astral_insight_ba"
  ```

## Phase 4: Install & Initialize (10-15 minutes)

- [ ] **Install dependencies**
  ```bash
  npm install
  ```
  (Takes 2-5 minutes)

- [ ] **Run database migrations**
  ```bash
  npm run prisma:migrate
  ```

- [ ] **Generate Prisma client**
  ```bash
  npm run prisma:generate
  ```

- [ ] **Seed realistic data**
  ```bash
  npm run seed
  ```
  (Takes 2-5 minutes, generates 50K orders)

## Phase 5: Start & Verify (2 minutes)

- [ ] **Start development server**
  ```bash
  npm run dev
  ```
  
  Expected output:
  ```
  ✅ Database connected successfully
  🚀 Server running on http://localhost:3001
  ```

- [ ] **Test API endpoint** (in new terminal)
  ```bash
  curl http://localhost:3001/api/kpis
  ```
  
  Should return JSON with KPI data

- [ ] **View database** (optional)
  ```bash
  npm run prisma:studio
  ```
  Opens UI at http://localhost:5555

## Phase 6: Connect Frontend (when ready)

- [ ] **Frontend is at**: `F:\Business Analysis\astral-insight-business` (start with `npm run dev`)
- [ ] **Backend API**: `http://localhost:3001`
- [ ] **Frontend**: `http://localhost:5174`

Update Sales.jsx & Forecasting.jsx to use:
```javascript
const response = await fetch('http://localhost:3001/api/kpis');
```

---

## ⏱️ Total Setup Time: ~30-40 minutes

- Prerequisites check: 5 min
- Database creation: 5 min
- Configuration: 3 min
- Install & migrate: 10-15 min (mostly waiting)
- Start & verify: 2-5 min

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| PostgreSQL not found | Download from https://www.postgresql.org/download/ |
| Port 3001 in use | `npm run dev` on different port: `PORT=3002 npm run dev` |
| Database connection error | Check DATABASE_URL in .env, verify PostgreSQL is running |
| "Cannot find module" | Run `npm install` again |
| Migration lock | `npm run prisma:migrate reset` then `npm run seed` |

## 📚 Files Created

```
backend-prisma/
├── src/
│   ├── server.ts                 # Express app
│   ├── api/routes.ts             # API endpoints
│   ├── services/
│   │   └── analytics.service.ts  # Business logic
│   ├── utils/
│   │   └── advanced-analytics.ts # Advanced queries
│   └── config/
│       └── prisma.ts             # DB client
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Data generation
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── .env.example                  # Environment template
├── SETUP.md                      # Detailed setup guide
├── README.md                     # Backend documentation
└── setup.ps1                     # Windows setup script
```

## 🎯 API Endpoints Available

- `GET /api/kpis` - Dashboard metrics
- `GET /api/revenue-trend` - Revenue trends
- `GET /api/top-products` - Top performers
- `GET /api/customers` - Customer list
- `GET /api/orders` - Transaction ledger
- `GET /api/forecast` - Predictions
- `GET /api/regions` - Regional analytics
- `GET /api/risk-alerts` - Risk detection
- `GET /api/ai-insights` - AI insights
- `GET /api/channels` - Channel breakdown
- `GET /api/customer-segmentation` - Cohort analysis

## ✨ Database Features

- **50,000+ realistic orders** with Indian customer names
- **42 enterprise customers** (all mandatory names included)
- **10 SaaS products** with pricing tiers
- **300 forecast predictions** with confidence intervals
- **8 AI insights** auto-generated
- **Regional analytics** for 6 geographic regions
- **Risk detection** with 8 active alerts
- **Production-grade schema** with indices and relationships

---

**Follow this checklist step-by-step and your backend will be production-ready! 🎉**
