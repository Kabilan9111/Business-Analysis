/**
 * AstralInsight BA — Frontend API Service
 * Connects to Express/Prisma backend at localhost:3001
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const defaultHeaders = { 'Content-Type': 'application/json' };

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: defaultHeaders,
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `API error: ${res.status}`);
  }
  return res.json();
}

// ============================================================================
// SALES API
// ============================================================================

export const salesAPI = {
  /** Full dashboard: KPIs + trends + products + regions + categories */
  getDashboard: (days = 30) => apiFetch(`/sales/dashboard?days=${days}`),

  /** Daily or monthly revenue trend */
  getRevenue: (period = 'daily', days = 30) =>
    apiFetch(`/sales/revenue?period=${period}&days=${days}`),

  /** Paginated transaction ledger */
  getTransactions: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
    ).toString();
    return apiFetch(`/sales/transactions${qs ? `?${qs}` : ''}`);
  },

  /** Category breakdown for pie chart */
  getCategories: () => apiFetch('/sales/categories'),

  /** Regional breakdown */
  getRegions: () => apiFetch('/sales/regions'),

  /** Top products */
  getProducts: (limit = 10) => apiFetch(`/sales/products?limit=${limit}`),

  /** Sales channel breakdown */
  getChannels: () => apiFetch('/sales/channels'),

  /** AI insights from real DB */
  getInsights: (days = 30) => apiFetch(`/sales/insights?days=${days}`),

  /** Risk alerts */
  getAlerts: () => apiFetch('/sales/alerts'),

  /** Customer intelligence summary */
  getCustomers: () => apiFetch('/sales/customers'),
};

// ============================================================================
// FORECAST API
// ============================================================================

export const forecastAPI = {
  /** Main forecast: historical + prediction + anomaly flags */
  getRevenueForecast: (days = 30, confidence = 95) =>
    apiFetch(`/forecast/revenue?days=${days}&confidence=${confidence}`),

  /** Raw historical revenue series */
  getHistorical: (days = 90) => apiFetch(`/forecast/historical?days=${days}`),

  /** Anomaly detection from real DB */
  getAnomalies: (days = 60) => apiFetch(`/forecast/anomalies?days=${days}`),

  /** Model comparison (DB-derived accuracy) */
  getModels: () => apiFetch('/forecast/models'),

  /** What-if scenario simulation (uses real base revenue from DB) */
  getScenario: (adSpendChange, conversionBoost, trafficSpike, days = 30) =>
    apiFetch('/forecast/scenario', {
      method: 'POST',
      body: JSON.stringify({ adSpendChange, conversionBoost, trafficSpike, days }),
    }),

  /** Inventory depletion forecast */
  getInventory: () => apiFetch('/forecast/inventory'),

  /** AI forecast insights */
  getInsights: () => apiFetch('/forecast/insights'),

  /** Forecast alerts (churn, anomalies, stockout) */
  getAlerts: () => apiFetch('/forecast/alerts'),

  /** Predictive funnel leakage */
  getFunnel: () => apiFetch('/forecast/funnel'),

  /** Customer growth forecast */
  getCustomers: (days = 30) => apiFetch(`/forecast/customers?days=${days}`),

  /** Forecast accuracy metrics */
  getAccuracy: () => apiFetch('/forecast/accuracy'),

  /** AI Copilot chat */
  copilotChat: (question) =>
    apiFetch('/copilot/chat', {
      method: 'POST',
      body: JSON.stringify({ question }),
    }),
};

// ============================================================================
// GENERIC HOOK HELPER — Returns { data, loading, error, refetch }
// ============================================================================

import { useState, useEffect, useCallback } from 'react';

export function useAPI(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result?.data ?? result);
    } catch (e) {
      setError(e.message || 'Failed to load data');
      console.error('[useAPI Error]', e);
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, refetch: load };
}
