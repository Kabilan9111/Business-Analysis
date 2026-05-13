from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class DatasetSchema(BaseModel):
    id: int
    name: str
    file_type: str
    row_count: int
    column_names: List[str]
    schema_map: Dict[str, str]
    upload_timestamp: datetime
    processing_status: str
    data_quality_score: float

    class Config:
        from_attributes = True

class KPIResponse(BaseModel):
    total_revenue: float
    total_orders: int
    average_order_value: float
    profit_margin: float
    revenue_growth: float
    repeat_customers: int
    top_products: List[Dict[str, Any]]
    category_performance: List[Dict[str, Any]]
    regional_performance: List[Dict[str, Any]]

class TrendResponse(BaseModel):
    dates: List[str]
    revenue: List[float]
    orders: List[int]

class ForecastResponse(BaseModel):
    dates: List[str]
    predicted_values: List[float]
    lower_bound: List[float]
    upper_bound: List[float]
    trend_direction: str

class AnalyticsResponse(BaseModel):
    kpis: KPIResponse
    trends: TrendResponse
    forecasts: Dict[str, ForecastResponse]
