from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.database_models import Dataset, DataRecord
from app.services.data_processing import DataProcessingService
from app.services.analytics import AnalyticsService
from app.services.forecasting import ForecastingService
import pandas as pd

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

def get_dataset_df(dataset_id: int, db: Session):
    """Helper function to get dataset as DataFrame."""
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    records = db.query(DataRecord).filter(DataRecord.dataset_id == dataset_id).all()
    data = [r.data for r in records]
    df = pd.DataFrame(data)
    
    return df, dataset

@router.get("/{dataset_id}/kpis")
async def get_kpis(dataset_id: int, db: Session = Depends(get_db)):
    """Get KPIs for a dataset."""
    try:
        df, dataset = get_dataset_df(dataset_id, db)
        kpis = AnalyticsService.calculate_kpis(df, dataset.schema_map)
        return {'status': 'success', 'kpis': kpis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{dataset_id}/trends")
async def get_trends(dataset_id: int, db: Session = Depends(get_db)):
    """Get revenue and order trends."""
    try:
        df, dataset = get_dataset_df(dataset_id, db)
        trends = AnalyticsService.calculate_trends(df, dataset.schema_map)
        return {'status': 'success', 'trends': trends}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{dataset_id}/categories")
async def get_category_distribution(dataset_id: int, db: Session = Depends(get_db)):
    """Get category distribution."""
    try:
        df, dataset = get_dataset_df(dataset_id, db)
        categories = AnalyticsService.get_category_distribution(df, dataset.schema_map)
        return {'status': 'success', 'categories': categories}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{dataset_id}/forecast/revenue")
async def forecast_revenue(dataset_id: int, periods: int = 30, db: Session = Depends(get_db)):
    """Get revenue forecast."""
    try:
        df, dataset = get_dataset_df(dataset_id, db)
        forecast = ForecastingService.generate_forecast(df, dataset.schema_map, periods)
        return {'status': 'success', 'forecast': forecast}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{dataset_id}/forecast/by-category")
async def forecast_by_category(dataset_id: int, periods: int = 30, db: Session = Depends(get_db)):
    """Get forecasts by category."""
    try:
        df, dataset = get_dataset_df(dataset_id, db)
        forecasts = ForecastingService.forecast_by_category(df, dataset.schema_map, periods)
        return {'status': 'success', 'forecasts': forecasts}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{dataset_id}/full-analytics")
async def get_full_analytics(dataset_id: int, db: Session = Depends(get_db)):
    """Get complete analytics dashboard data."""
    try:
        df, dataset = get_dataset_df(dataset_id, db)
        
        kpis = AnalyticsService.calculate_kpis(df, dataset.schema_map)
        trends = AnalyticsService.calculate_trends(df, dataset.schema_map)
        categories = AnalyticsService.get_category_distribution(df, dataset.schema_map)
        forecast = ForecastingService.generate_forecast(df, dataset.schema_map, 30)
        
        return {
            'status': 'success',
            'dataset_id': dataset_id,
            'dataset_name': dataset.name,
            'kpis': kpis,
            'trends': trends,
            'categories': categories,
            'forecast': forecast,
            'data_quality': dataset.data_quality_score
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
