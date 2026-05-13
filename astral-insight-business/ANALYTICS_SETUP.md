# AstralInsight Analytics Platform

A production-grade AI-powered business analytics and forecasting SaaS platform built with React, FastAPI, PostgreSQL, and Prophet.

## Features

✅ **Real Data Ingestion**
- CSV/XLSX file upload and parsing
- Automatic schema detection
- Data quality scoring
- Validation of missing values, duplicates, and data integrity

✅ **Dynamic Sales Analytics**
- Real-time KPI calculations from uploaded data
- Revenue, orders, and customer metrics
- Category and regional performance analysis
- Interactive charts and visualizations

✅ **AI-Powered Forecasting**
- Prophet-based revenue forecasting
- 30-day and 90-day predictions with confidence intervals
- Category-level forecasts
- Seasonal pattern detection

✅ **Enterprise UI**
- Dark theme with purple neon accents (#6432E6)
- Glassmorphism design patterns
- Smooth animations and transitions
- Fully responsive dashboard

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Recharts (data visualization)
- Framer Motion (animations)
- Lucide React (icons)

### Backend
- FastAPI (Python)
- SQLAlchemy ORM
- PostgreSQL database
- Pandas & NumPy (data processing)
- Prophet (forecasting model)

## Project Structure

```
astral-insight-business/
├── src/                          # React frontend
│   ├── pages/
│   │   ├── Sales.jsx            # Sales analytics dashboard
│   │   ├── Forecasting.jsx      # AI forecasting module
│   │   └── ...
│   └── ...
├── backend/                      # FastAPI backend
│   ├── app/
│   │   ├── main.py              # FastAPI application
│   │   ├── database.py          # SQLAlchemy setup
│   │   ├── models/
│   │   │   ├── database_models.py
│   │   │   └── schemas.py
│   │   ├── routes/
│   │   │   ├── datasets.py
│   │   │   └── analytics.py
│   │   └── services/
│   │       ├── data_processing.py
│   │       ├── analytics.py
│   │       └── forecasting.py
│   ├── requirements.txt
│   ├── .env
│   └── uploads/
└── ...
```

## Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL 12+

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   source venv/bin/activate  # Mac/Linux
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure PostgreSQL**
   - Create a PostgreSQL database named `astral_insight`
   - Update `.env` file with your database credentials:
     ```
     DATABASE_URL=postgresql://postgres:your_password@localhost:5432/astral_insight
     ```

5. **Run the backend**
   ```bash
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   
   Backend will be available at `http://localhost:8000`
   API documentation: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory** (from root)
   ```bash
   cd frontend directory (astral-insight-business)
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start dev server**
   ```bash
   npm run dev
   ```
   
   Frontend will be available at `http://localhost:5173`

## Usage

### 1. Upload Data
1. Navigate to the "Upload Data" page
2. Upload a CSV or XLSX file with sales data
3. System will auto-detect schema and calculate data quality score
4. View data preview and validation results

### 2. View Sales Analytics
1. Go to the "Sales" page
2. Select a dataset from the dropdown
3. View real-time KPIs:
   - Total Revenue
   - Total Orders
   - Average Order Value
   - Repeat Customers
4. Analyze revenue trends, category performance, and regional metrics
5. Export reports as needed

### 3. Generate Forecasts
1. Navigate to "Forecasting" page
2. Select a dataset and forecast period (7, 30, or 90 days)
3. View AI-generated predictions with confidence intervals
4. Analyze category-level forecasts
5. Use insights for business planning

## API Endpoints

### Dataset Management
- `POST /api/datasets/upload` - Upload and process file
- `GET /api/datasets/list` - List all datasets
- `GET /api/datasets/{id}` - Get dataset metadata
- `GET /api/datasets/{id}/preview` - Get data preview

### Analytics
- `GET /api/analytics/{id}/kpis` - Get KPIs
- `GET /api/analytics/{id}/trends` - Get trends
- `GET /api/analytics/{id}/categories` - Get category distribution
- `GET /api/analytics/{id}/full-analytics` - Get complete dashboard data

### Forecasting
- `GET /api/analytics/{id}/forecast/revenue` - Revenue forecast
- `GET /api/analytics/{id}/forecast/by-category` - Category forecasts

## Data Format Requirements

### Supported Columns
The system auto-detects these column types:
- **Date Column**: `date`, `time`, `created_at`, `timestamp`
- **Revenue Column**: `revenue`, `sales`, `amount`, `total`, `price`
- **Quantity Column**: `quantity`, `qty`, `count`, `units`
- **Category Column**: `category`, `type`, `product_type`, `segment`
- **Region Column**: `region`, `state`, `country`, `location`
- **Customer Column**: `customer`, `client`, `user`, `account`
- **Product Column**: `product`, `item`, `sku`, `name`

### Example CSV Format
```csv
order_date,product,category,region,quantity,amount
2024-01-01,Widget A,Electronics,North America,5,250.00
2024-01-02,Widget B,Appliances,Europe,3,180.00
...
```

## Features & Capabilities

### Data Processing
- Automatic missing value detection
- Duplicate row identification
- Data quality scoring (0-100)
- Type inference and validation

### Analytics Engine
- Revenue aggregation by time period
- Customer segmentation
- Product performance ranking
- Regional sales analysis
- Profit margin calculation

### Forecasting (Prophet)
- Time-series decomposition
- Trend analysis
- Seasonal pattern detection
- Confidence interval generation (95%)
- Multi-category forecasting

### Visualizations
- Revenue trend lines
- Category distribution charts
- Regional performance maps
- Forecast confidence bands
- KPI cards with metrics

## Troubleshooting

### Backend Connection Issues
```
Error: Could not connect to database
Solution: Ensure PostgreSQL is running and DATABASE_URL is correct
```

### File Upload Errors
```
Error: Invalid file format
Solution: Use CSV or XLSX files. Ensure data has proper headers.
```

### Forecast Generation
```
Error: Insufficient data for forecasting
Solution: Upload dataset with at least 10 records
```

## Performance Notes

- Large datasets (>100k rows) may take longer to process
- Prophet forecasting requires 10+ data points minimum
- Data is cached in PostgreSQL for quick access
- API responses cached when possible

## Production Deployment

For production deployment:
1. Set `DEBUG=False` in FastAPI
2. Use production PostgreSQL instance
3. Configure CORS properly
4. Use environment variables for secrets
5. Enable SSL/TLS encryption
6. Set up monitoring and logging
7. Use gunicorn/uvicorn with multiple workers

## License

Proprietary - AstralInsight BA Platform

## Support

For issues or questions, contact the development team.
