import pandas as pd
import numpy as np
from typing import Dict, List, Any, Tuple

class AnalyticsService:
    """Service for calculating business analytics and KPIs."""

    @staticmethod
    def calculate_kpis(df: pd.DataFrame, schema_map: Dict[str, str]) -> Dict[str, Any]:
        """Calculate key performance indicators from dataset."""
        kpis = {}
        
        try:
            # Find the relevant columns
            revenue_col = next((col for col, typ in schema_map.items() if typ == 'revenue_column'), None)
            quantity_col = next((col for col, typ in schema_map.items() if typ == 'quantity_column'), None)
            date_col = next((col for col, typ in schema_map.items() if typ == 'date_column'), None)
            category_col = next((col for col, typ in schema_map.items() if typ == 'category_column'), None)
            region_col = next((col for col, typ in schema_map.items() if typ == 'region_column'), None)
            customer_col = next((col for col, typ in schema_map.items() if typ == 'customer_column'), None)
            product_col = next((col for col, typ in schema_map.items() if typ == 'product_column'), None)
            
            # Prepare data
            df_copy = df.copy()
            if revenue_col:
                df_copy[revenue_col] = pd.to_numeric(df_copy[revenue_col], errors='coerce')
            if quantity_col:
                df_copy[quantity_col] = pd.to_numeric(df_copy[quantity_col], errors='coerce')
            
            # Calculate total revenue
            kpis['total_revenue'] = float(df_copy[revenue_col].sum()) if revenue_col else 0.0
            
            # Calculate total orders (rows count)
            kpis['total_orders'] = len(df_copy)
            
            # Calculate average order value
            kpis['average_order_value'] = kpis['total_revenue'] / kpis['total_orders'] if kpis['total_orders'] > 0 else 0.0
            
            # Calculate profit margin (assuming 30% average for demo)
            kpis['profit_margin'] = 0.30
            
            # Calculate revenue growth
            if date_col:
                df_copy[date_col] = pd.to_datetime(df_copy[date_col], errors='coerce')
                df_sorted = df_copy.sort_values(date_col)
                
                # Split data into two halves
                mid_point = len(df_sorted) // 2
                first_half = df_sorted.iloc[:mid_point][revenue_col].sum() if revenue_col else 0
                second_half = df_sorted.iloc[mid_point:][revenue_col].sum() if revenue_col else 0
                
                kpis['revenue_growth'] = ((second_half - first_half) / first_half * 100) if first_half > 0 else 0.0
            else:
                kpis['revenue_growth'] = 0.0
            
            # Calculate repeat customers
            kpis['repeat_customers'] = 0
            if customer_col:
                customer_counts = df_copy[customer_col].value_counts()
                kpis['repeat_customers'] = int((customer_counts > 1).sum())
            
            # Top products
            kpis['top_products'] = []
            if product_col and revenue_col:
                top_prods = df_copy.groupby(product_col)[revenue_col].sum().nlargest(5).to_dict()
                kpis['top_products'] = [{'name': k, 'revenue': v} for k, v in top_prods.items()]
            
            # Category performance
            kpis['category_performance'] = []
            if category_col and revenue_col:
                cat_perf = df_copy.groupby(category_col)[revenue_col].sum().to_dict()
                kpis['category_performance'] = [{'category': k, 'revenue': v} for k, v in sorted(cat_perf.items(), key=lambda x: x[1], reverse=True)]
            
            # Regional performance
            kpis['regional_performance'] = []
            if region_col and revenue_col:
                reg_perf = df_copy.groupby(region_col)[revenue_col].sum().to_dict()
                kpis['regional_performance'] = [{'region': k, 'revenue': v} for k, v in sorted(reg_perf.items(), key=lambda x: x[1], reverse=True)]
            
            return kpis
        except Exception as e:
            print(f"Error calculating KPIs: {str(e)}")
            return {}

    @staticmethod
    def calculate_trends(df: pd.DataFrame, schema_map: Dict[str, str]) -> Dict[str, Any]:
        """Calculate revenue and order trends over time."""
        trends = {'dates': [], 'revenue': [], 'orders': []}
        
        try:
            date_col = next((col for col, typ in schema_map.items() if typ == 'date_column'), None)
            revenue_col = next((col for col, typ in schema_map.items() if typ == 'revenue_column'), None)
            
            if not date_col or not revenue_col:
                return trends
            
            df_copy = df.copy()
            df_copy[date_col] = pd.to_datetime(df_copy[date_col], errors='coerce')
            df_copy[revenue_col] = pd.to_numeric(df_copy[revenue_col], errors='coerce')
            
            df_copy = df_copy.dropna(subset=[date_col, revenue_col])
            df_copy = df_copy.sort_values(date_col)
            
            # Daily aggregation
            daily_revenue = df_copy.groupby(df_copy[date_col].dt.date)[revenue_col].sum()
            daily_orders = df_copy.groupby(df_copy[date_col].dt.date).size()
            
            trends['dates'] = [str(d) for d in daily_revenue.index[-30:]]  # Last 30 days
            trends['revenue'] = daily_revenue[-30:].values.tolist()
            trends['orders'] = daily_orders[-30:].values.tolist()
            
            return trends
        except Exception as e:
            print(f"Error calculating trends: {str(e)}")
            return trends

    @staticmethod
    def get_category_distribution(df: pd.DataFrame, schema_map: Dict[str, str]) -> List[Dict[str, Any]]:
        """Get category distribution."""
        category_col = next((col for col, typ in schema_map.items() if typ == 'category_column'), None)
        revenue_col = next((col for col, typ in schema_map.items() if typ == 'revenue_column'), None)
        
        if not category_col or not revenue_col:
            return []
        
        df_copy = df.copy()
        df_copy[revenue_col] = pd.to_numeric(df_copy[revenue_col], errors='coerce')
        
        dist = df_copy.groupby(category_col)[revenue_col].sum().to_dict()
        return [{'name': k, 'value': v} for k, v in sorted(dist.items(), key=lambda x: x[1], reverse=True)]
