import pandas as pd
import numpy as np
from datetime import datetime
from typing import Dict, List, Tuple, Any
import json

class DataProcessingService:
    """Service for handling data upload, parsing, validation, and schema detection."""

    @staticmethod
    def parse_file(file_path: str, file_type: str) -> pd.DataFrame:
        """Parse CSV or XLSX file into pandas DataFrame."""
        try:
            if file_type.lower() == 'csv':
                df = pd.read_csv(file_path)
            elif file_type.lower() in ['xlsx', 'xls']:
                df = pd.read_excel(file_path)
            else:
                raise ValueError(f"Unsupported file type: {file_type}")
            return df
        except Exception as e:
            raise Exception(f"Error parsing file: {str(e)}")

    @staticmethod
    def detect_schema(df: pd.DataFrame) -> Dict[str, str]:
        """Auto-detect schema by analyzing column names and data types."""
        schema_map = {}
        
        for col in df.columns:
            col_lower = col.lower().strip()
            
            # Check for date columns
            if any(term in col_lower for term in ['date', 'time', 'created_at', 'timestamp']):
                schema_map[col] = 'date_column'
            # Check for revenue/sales columns
            elif any(term in col_lower for term in ['revenue', 'sales', 'amount', 'total', 'price']):
                schema_map[col] = 'revenue_column'
            # Check for quantity columns
            elif any(term in col_lower for term in ['quantity', 'qty', 'count', 'units']):
                schema_map[col] = 'quantity_column'
            # Check for category columns
            elif any(term in col_lower for term in ['category', 'type', 'product_type', 'segment']):
                schema_map[col] = 'category_column'
            # Check for region columns
            elif any(term in col_lower for term in ['region', 'state', 'country', 'location', 'area']):
                schema_map[col] = 'region_column'
            # Check for customer columns
            elif any(term in col_lower for term in ['customer', 'client', 'user', 'account']):
                schema_map[col] = 'customer_column'
            # Check for product columns
            elif any(term in col_lower for term in ['product', 'item', 'sku', 'name']):
                schema_map[col] = 'product_column'
            else:
                schema_map[col] = 'unknown_column'
        
        return schema_map

    @staticmethod
    def validate_dataset(df: pd.DataFrame) -> Dict[str, Any]:
        """Validate dataset and return quality metrics."""
        validation = {
            'total_rows': len(df),
            'total_columns': len(df.columns),
            'missing_values': int(df.isnull().sum().sum()),
            'duplicate_rows': int(df.duplicated().sum()),
            'missing_by_column': df.isnull().sum().to_dict(),
            'data_types': df.dtypes.astype(str).to_dict(),
        }
        
        # Calculate data quality score (0-100)
        total_cells = len(df) * len(df.columns)
        missing_cells = df.isnull().sum().sum()
        duplicate_impact = len(df.duplicated()) * 0.5
        
        quality_score = max(0, 100 - (missing_cells / total_cells * 100) - (duplicate_impact / len(df) * 100))
        validation['data_quality_score'] = round(quality_score, 2)
        
        return validation

    @staticmethod
    def prepare_timeseries_data(df: pd.DataFrame, schema_map: Dict[str, str], 
                                date_col: str, value_col: str, agg_func: str = 'sum') -> pd.DataFrame:
        """Prepare time-series data for analytics."""
        try:
            # Copy dataframe
            df_copy = df.copy()
            
            # Convert date column to datetime
            df_copy[date_col] = pd.to_datetime(df_copy[date_col], errors='coerce')
            df_copy = df_copy.dropna(subset=[date_col])
            
            # Ensure value column is numeric
            df_copy[value_col] = pd.to_numeric(df_copy[value_col], errors='coerce')
            df_copy = df_copy.dropna(subset=[value_col])
            
            # Sort by date
            df_copy = df_copy.sort_values(date_col)
            
            # Aggregate by date
            if agg_func == 'sum':
                ts_data = df_copy.groupby(date_col)[value_col].sum().reset_index()
            elif agg_func == 'mean':
                ts_data = df_copy.groupby(date_col)[value_col].mean().reset_index()
            elif agg_func == 'count':
                ts_data = df_copy.groupby(date_col).size().reset_index(name=value_col)
            else:
                ts_data = df_copy.groupby(date_col)[value_col].sum().reset_index()
            
            return ts_data
        except Exception as e:
            raise Exception(f"Error preparing time-series data: {str(e)}")

    @staticmethod
    def convert_to_dict(df: pd.DataFrame) -> List[Dict[str, Any]]:
        """Convert DataFrame to list of dictionaries."""
        return df.replace({np.nan: None}).to_dict('records')
