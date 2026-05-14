# AstralInsight BA - Enterprise Analytics Platform Backend

> Production-grade analytics backend using PostgreSQL, Prisma, Express.js, and TypeScript

## 🎯 Overview

This is the backend infrastructure for AstralInsight BA - a premium enterprise-grade analytics SaaS platform comparable to Stripe Analytics, HubSpot, Tableau, and modern BI platforms.

**Features:**
- ✅ PostgreSQL database with normalized schema
- ✅ Prisma ORM for type-safe database access
- ✅ Express.js REST API
- ✅ 50,000+ realistic enterprise transaction records
- ✅ 42 Indian enterprise customers with authentic names
- ✅ Advanced analytics and KPI calculations
- ✅ Forecasting data for 30-day predictions
- ✅ AI-generated insights and risk alerts
- ✅ Regional and product performance analytics
- ✅ Production-grade architecture

## 📊 Database Schema

### Core Models
- **Customer**: Enterprise customers with subscription tiers, churn risk, and lifetime value
- **Product**: SaaS/API products with pricing, MRR, and performance metrics
- **Order**: Transaction ledger (50,000+ records) with payment and refund tracking
- **Forecast**: AI-powered revenue predictions with confidence intervals
- **RevenueInsight**: Auto-generated business intelligence
- **RiskAlert**: Anomaly detection and churn warnings
- **RegionPerformance**: Regional sales analytics
- **ProductPerformance**: Per-product KPI aggregation
- **UserActivity**: Customer engagement tracking
- **DailyMetric & MonthlyMetric**: Time-series aggregations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- npm or yarn

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env

# 3. Update DATABASE_URL in .env
# Example: DATABASE_URL="postgresql://postgres:password@localhost:5432/astral_insight_ba"

# 4. Create PostgreSQL database
psql -U postgres
CREATE DATABASE astral_insight_ba;
exit

# 5. Run migrations
npm run prisma:migrate

# 6. Seed realistic data (50,000 orders + customers)
npm run seed

# 7. Start development server
npm run dev
```

### Production Setup

```bash
# Build
npm run build

# Start
npm start
```

## 📡 API Endpoints

### KPI & Dashboard
- `GET /api/kpis` - Comprehensive dashboard metrics
- `GET /api/revenue-trend` - Historical revenue with trends
- `GET /api/top-products` - Top performing products

### Sales & Transactions
- `GET /api/orders` - Enterprise transaction ledger
- `GET /api/orders?limit=100` - Paginated orders
- `GET /api/channels` - Sales channel breakdown

### Customers
- `GET /api/customers` - Customer directory
- `GET /api/customer-segmentation` - Tier analysis + LTV
- `GET /api/customer-segmentation?limit=50` - Pagination

### Analytics
- `GET /api/regions` - Regional performance
- `GET /api/forecast` - 30-day forecast predictions
- `GET /api/forecast?days=90` - Extended forecasts
- `GET /api/ai-insights` - Auto-generated business insights
- `GET /api/risk-alerts` - Active risk & churn warnings

### Health
- `GET /` - API overview
- `GET /api/health` - Health check

## 📊 Database Statistics

### Seeded Data
```
✓ Customers: 42 (with mandatory Indian names)
✓ Products: 10 (SaaS/API/Services)
✓ Orders: 50,000+ (realistic transactions)
✓ Forecasts: 300+ (30-day predictions × 10 products)
✓ Insights: 8 (auto-generated)
✓ Risk Alerts: 8 (active alerts)
✓ User Activities: 1,000+ (engagement logs)
✓ Regional Performance: 6 regions
✓ Product Performance: 10 products
```

### Indian Customer Names (Mandatory)
- Kabilan, Yashikaa, Vaishnavi, Samiksha, Arjun
- Varun, Adhithya, Nithin, Pawan, Kanishk
- Plus 32 additional authentic Indian names

## 🏗️ Architecture

```
backend-prisma/
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   └── seed.ts                # Data generation
├── src/
│   ├── api/
│   │   └── routes.ts          # API endpoints
│   ├── services/
│   │   └── analytics.service  # Business logic & queries
│   ├── config/
│   │   └── prisma.ts          # Database client
│   └── server.ts              # Express app
├── dist/                      # Compiled JavaScript
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
└── .env.example               # Environment template
```

## 📈 Key Features

### Real Business Logic
- ✅ Monthly Recurring Revenue (MRR) calculation
- ✅ Customer Lifetime Value (LTV) tracking
- ✅ Churn risk scoring (0-100)
- ✅ Revenue growth percentages
- ✅ Conversion rate analytics
- ✅ Refund rate tracking
- ✅ Regional market share analysis
- ✅ Sales channel attribution

### Analytics Queries
All KPIs are computed from real database queries:
- Total Revenue, Repeat Customers, Retention Rate
- Average Order Value, Refund Rate, Churn Risk
- Top Products, Regional Performance
- Customer Segmentation, Channel Breakdown
- 30-day Forecasts with confidence intervals

### Production-Grade Design
- Type-safe Prisma queries
- Indexed database columns for performance
- Decimal precision for financial data
- Cascade deletes for data integrity
- Connection pooling for scalability
- Error handling & validation

## 🔧 Commands

```bash
# Development
npm run dev                    # Start dev server with hot reload
npm run build                  # Build for production
npm start                      # Run production build

# Database
npm run prisma:migrate         # Run migrations
npm run prisma:generate        # Generate Prisma client
npm run prisma:seed            # Run seed script
npm run prisma:studio          # Open Prisma Studio UI

# All-in-one
npm run setup                  # Install + migrate + seed
```

## 📝 Environment Variables

```env
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/astral_insight_ba"
NODE_ENV="development"
PORT=3001
```

## 🔌 Integration with Frontend

### React/Vite Dashboard Connection
```typescript
const API_BASE = 'http://localhost:3001/api';

// Fetch KPIs
const response = await fetch(`${API_BASE}/kpis`);
const { data } = await response.json();

// All frontend data comes from real database!
```

## 📦 Dependencies

### Core
- `express` - Web framework
- `@prisma/client` - ORM
- `postgres` - Database driver (via Prisma)

### Development
- `typescript` - Type safety
- `tsx` - TypeScript execution
- `@types/express` - Type definitions
- `@types/node` - Node.js types

### Data Generation
- `@faker-js/faker` - Realistic data generation

## 🎓 Learning Resources

- [Prisma Docs](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🏆 Production Checklist

- [ ] PostgreSQL database configured and backed up
- [ ] `.env` file with secure credentials
- [ ] Migrations applied (`npm run prisma:migrate`)
- [ ] Data seeded (`npm run seed`)
- [ ] API tested against all endpoints
- [ ] CORS configured for frontend domain
- [ ] Rate limiting implemented
- [ ] Error logging configured
- [ ] Database monitoring enabled
- [ ] Auto-scaling configured

## 📞 Support

For issues or questions about this backend:
1. Check the logs: `npm run dev`
2. Verify database connection
3. Run `npm run prisma:studio` to inspect data
4. Check API responses in browser console

## 📄 License

Proprietary - AstralInsight BA 2024

---

**Built with ❤️ for enterprise-grade analytics**
