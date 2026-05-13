import pandas as pd
import numpy as np
from typing import Dict, List, Any, Tuple
from prophet import Prophet
import warnings
warnings.filterwarnings('ignore')

class ForecastingService:
    """Service for AI-powered forecasting using Prophet."""

    @staticmethod
    def prepare_forecast_data(df: pd.DataFrame, schema_map: Dict[str, str]) -> Tuple[pd.DataFrame, str]:
        """Prepare data in Prophet format (ds, y columns)."""
        date_col = next((col for col, typ in schema_map.items() if typ == 'date_column'), None)
        revenue_col = next((col for col, typ in schema_map.items() if typ == 'revenue_column'), None)
        
        if not date_col or not revenue_col:
            return None, None
        
        df_copy = df.copy()
        df_copy[date_col] = pd.to_datetime(df_copy[date_col], errors='coerce')
        df_copy[revenue_col] = pd.to_numeric(df_copy[revenue_col], errors='coerce')
        
        # Clean data
        df_copy = df_copy.dropna(subset=[date_col, revenue_col])
        df_copy = df_copy.sort_values(date_col)
        
        # Aggregate by date
        forecast_df = df_copy.groupby(date_col)[revenue_col].sum().reset_index()
        forecast_df.columns = ['ds', 'y']
        forecast_df['ds'] = pd.to_datetime(forecast_df['ds'])
        
        return forecast_df, revenue_col

    @staticmethod
    def generate_forecast(df: pd.DataFrame, schema_map: Dict[str, str], periods: int = 30) -> Dict[str, Any]:
        """Generate forecast using Prophet model."""
        try:
            # Prepare data
            forecast_data, metric_name = ForecastingService.prepare_forecast_data(df, schema_map)
            
            if forecast_data is None or len(forecast_data) < 10:
                return {
                    'status': 'error',
                    'message': 'Insufficient data for forecasting (minimum 10 data points required)'
                }
            
            # Train Prophet model
            model = Prophet(
                yearly_seasonality=True,
                weekly_seasonality=True,
                daily_seasonality=False,
                interval_width=0.95,
                changepoint_prior_scale=0.05,
                seasonality_prior_scale=10.0
            )
            
            with warnings.catch_warnings():
                warnings.simplefilter("ignore")
                model.fit(forecast_data)
            
            # Generate future dates
            future = model.make_future_dataframe(periods=periods)
            forecast = model.predict(future)
            
            # Extract forecast for future periods only
            future_forecast = forecast[forecast['ds'] > forecast_data['ds'].max()].copy()
            
            # Prepare response
            response = {
                'dates': [d.strftime('%Y-%m-%d') for d in future_forecast['ds']],
                'predicted_values': future_forecast['yhat'].round(2).tolist(),
                'lower_bound': future_forecast['yhat_lower'].round(2).tolist(),
                'upper_bound': future_forecast['yhat_upper'].round(2).tolist(),
                'metric': metric_name,
                'periods': periods,
                'trend_direction': 'up' if future_forecast['yhat'].iloc[-1] > forecast_data['y'].mean() else 'down'
            }
            
            return response
        except Exception as e:
            return {
                'status': 'error',
                'message': f'Forecasting error: {str(e)}'
            }

    @staticmethod
    def forecast_by_category(df: pd.DataFrame, schema_map: Dict[str, str], periods: int = 30) -> Dict[str, Any]:
        """Generate forecasts per category."""
        category_col = next((col for col, typ in schema_map.items() if typ == 'category_column'), None)
        date_col = next((col for col, typ in schema_map.items() if typ == 'date_column'), None)
        revenue_col = next((col for col, typ in schema_map.items() if typ == 'revenue_column'), None)
        
        if not all([category_col, date_col, revenue_col]):
            return {}
        
        df_copy = df.copy()
        df_copy[date_col] = pd.to_datetime(df_copy[date_col], errors='coerce')
        df_copy[revenue_col] = pd.to_numeric(df_copy[revenue_col], errors='coerce')
        df_copy = df_copy.dropna(subset=[date_col, revenue_col])
        
        forecasts = {}
        for category in df_copy[category_col].unique()[:5]:  # Top 5 categories
            cat_data = df_copy[df_copy[category_col] == category]
            ts_data = cat_data.groupby(date_col)[revenue_col].sum().reset_index()
            ts_data.columns = ['ds', 'y']
            
            if len(ts_data) >= 10:
                try:
                    model = Prophet(interval_width=0.95)
                    with warnings.catch_warnings():
                        warnings.simplefilter("ignore")
                        model.fit(ts_data)
                    
                    future = model.make_future_dataframe(periods=periods)
                    forecast = model.predict(future)
                    future_forecast = forecast[forecast['ds'] > ts_data['ds'].max()].copy()
                    
                    forecasts[str(category)] = {
                        'dates': [d.strftime('%Y-%m-%d') for d in future_forecast['ds']],
                        'predicted_values': future_forecast['yhat'].round(2).tolist(),
                    }
                except:
                    pass
        
        return forecasts
