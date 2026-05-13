from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON, Boolean, DECIMAL
from sqlalchemy.sql import func
from datetime import datetime
from app.database import Base

class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    file_type = Column(String)  # csv, xlsx
    row_count = Column(Integer)
    column_names = Column(JSON)  # Column names detected
    schema_map = Column(JSON)  # Auto-detected schema mapping
    upload_timestamp = Column(DateTime, server_default=func.now())
    processing_status = Column(String, default="processed")  # processing, processed, failed
    file_path = Column(String)
    
    # Data stats
    missing_values_count = Column(Integer, default=0)
    duplicate_rows = Column(Integer, default=0)
    data_quality_score = Column(Float, default=0.0)

class DataRecord(Base):
    __tablename__ = "data_records"

    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, index=True)
    data = Column(JSON)  # The actual record data

class Forecast(Base):
    __tablename__ = "forecasts"

    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, index=True)
    metric_name = Column(String)  # revenue, orders, etc
    forecast_type = Column(String)  # 7days, 30days, 90days
    forecast_data = Column(JSON)  # Predicted values with confidence intervals
    created_at = Column(DateTime, server_default=func.now())
    valid_until = Column(DateTime)

class AnalyticsCache(Base):
    __tablename__ = "analytics_cache"

    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, index=True)
    cache_key = Column(String, unique=True)
    cache_data = Column(JSON)
    created_at = Column(DateTime, server_default=func.now())
    expires_at = Column(DateTime)
