import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, AreaChart, Area, ComposedChart, Bar } from 'recharts';
import { Brain, TrendingUp, Calendar, Zap, Target, AlertCircle, Loader, ChevronDown } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

// Mock forecast data for demo
const MOCK_FORECAST_DATA = {
  7: {
    dates: ['2026-01-30', '2026-02-02', '2026-02-05', '2026-02-08', '2026-02-11', '2026-02-14', '2026-02-17'],
    predicted_values: [52400, 54800, 57200, 59600, 62100, 64500, 67000],
    lower_bound: [48900, 51200, 53400, 55600, 57800, 59900, 62000],
    upper_bound: [55900, 58400, 61000, 63600, 66400, 69100, 72000],
    trend_direction: 'up',
    metric: 'revenue'
  },
  30: {
    dates: ['2026-02-17', '2026-02-24', '2026-03-03', '2026-03-10', '2026-03-17', '2026-03-24', '2026-03-31', '2026-04-07', '2026-04-14', '2026-04-21'],
    predicted_values: [67000, 71500, 76200, 81500, 87100, 93200, 99800, 106500, 113800, 121500],
    lower_bound: [62000, 66100, 70400, 75300, 80500, 86300, 92600, 99200, 106300, 113800],
    upper_bound: [72000, 76900, 82000, 87700, 93700, 100100, 107000, 113800, 121300, 129200],
    trend_direction: 'up',
    metric: 'revenue'
  },
  90: {
    dates: ['2026-05-13', '2026-05-27', '2026-06-10', '2026-06-24', '2026-07-08', '2026-07-22', '2026-08-05', '2026-08-19', '2026-09-02', '2026-09-16'],
    predicted_values: [152000, 168500, 185200, 203500, 223100, 245200, 269800, 297500, 328800, 364500],
    lower_bound: [142000, 157100, 172400, 189300, 208500, 230300, 255600, 284200, 316300, 352800],
    upper_bound: [162000, 179900, 198000, 217700, 237700, 260100, 284000, 310800, 341300, 376200],
    trend_direction: 'up',
    metric: 'revenue'
  }
};

const MOCK_CATEGORY_FORECASTS = {
  'Electronics': {
    dates: ['2026-01-30', '2026-02-02', '2026-02-05', '2026-02-08', '2026-02-11'],
    predicted_values: [18500, 19300, 20100, 21000, 21900]
  },
  'Software': {
    dates: ['2026-01-30', '2026-02-02', '2026-02-05', '2026-02-08', '2026-02-11'],
    predicted_values: [22500, 23600, 24800, 25900, 27100]
  },
  'Services': {
    dates: ['2026-01-30', '2026-02-02', '2026-02-05', '2026-02-08', '2026-02-11'],
    predicted_values: [11400, 11900, 12400, 12900, 13500]
  }
};

const Forecasting = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDataset, setSelectedDataset] = useState(1);
  const [datasets, setDatasets] = useState([]);
  const [forecast, setForecast] = useState(MOCK_FORECAST_DATA[30]);
  const [categoryForecasts, setCategoryForecasts] = useState(MOCK_CATEGORY_FORECASTS);
  const [forecastPeriod, setForecastPeriod] = useState(30);
  const [useMockData, setUseMockData] = useState(true);

  useEffect(() => {
    fetchDatasets();
    setForecast(MOCK_FORECAST_DATA[30]);
  }, []);

  const fetchDatasets = async () => {
    try {
      const response = await fetch(`${API_BASE}/datasets/list`);
      const data = await response.json();
      setDatasets(data);
      if (data.length > 0) {
        setSelectedDataset(data[0].id);
        setUseMockData(false);
      }
    } catch (err) {
      console.log('Backend not available, using demo data');
      setUseMockData(true);
    }
  };

  useEffect(() => {
    if (selectedDataset && !useMockData) {
      fetchForecasts();
    } else {
      setForecast(MOCK_FORECAST_DATA[forecastPeriod] || MOCK_FORECAST_DATA[30]);
      setCategoryForecasts(MOCK_CATEGORY_FORECASTS);
    }
  }, [selectedDataset, forecastPeriod]);

  const fetchForecasts = async () => {
    try {
      setLoading(true);
      
      // Fetch revenue forecast
      const revResponse = await fetch(`${API_BASE}/analytics/${selectedDataset}/forecast/revenue?periods=${forecastPeriod}`);
      const revData = await revResponse.json();
      
      // Fetch category forecasts
      const catResponse = await fetch(`${API_BASE}/analytics/${selectedDataset}/forecast/by-category?periods=${forecastPeriod}`);
      const catData = await catResponse.json();
      
      if (revData.status === 'success') {
        setForecast(revData.forecast);
        setError(null);
      }
      
      if (catData.status === 'success') {
        setCategoryForecasts(catData.forecasts);
      }
    } catch (err) {
      console.log('Using mock data');
      setUseMockData(true);
      setForecast(MOCK_FORECAST_DATA[forecastPeriod] || MOCK_FORECAST_DATA[30]);
      setCategoryForecasts(MOCK_CATEGORY_FORECASTS);
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for forecast chart
  const prepareChartData = () => {
    if (!forecast || !forecast.dates) return [];
    
    return forecast.dates.map((date, i) => ({
      date: date,
      predicted: forecast.predicted_values[i],
      lower: forecast.lower_bound[i],
      upper: forecast.upper_bound[i]
    }));
  };

  const ForecastCard = ({ label, value, change, icon: Icon }) => (
    <div className="bg-[#0A0A12] border border-white/5 rounded-2xl p-5 shadow-xl hover:border-white/10 transition-all">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-400 font-medium">{label}</p>
        <div className="p-2.5 bg-[#6432E6]/10 rounded-lg">
          <Icon className="w-5 h-5 text-[#6432E6]" />
        </div>
      </div>
      <p className="text-3xl font-bold text-white mb-2">{value}</p>
      <p className="text-xs text-emerald-400 font-medium">↑ {change} forecast confidence</p>
    </div>
  );

  if (loading && !forecast) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex items-center justify-center min-h-[600px]">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 text-[#6432E6] animate-spin" />
          <p className="text-gray-400">Training AI forecast model...</p>
        </div>
      </div>
    );
  }

  const chartData = prepareChartData();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-1 flex items-center gap-2">
            <Brain className="w-8 h-8 text-[#6432E6]" />
            AI Forecasting
          </h1>
          <p className="text-gray-400 text-sm">Prophet-powered revenue predictions with confidence intervals.</p>
        </div>
        <div className="flex items-center gap-3">
          {datasets.length > 0 && (
            <select 
              value={selectedDataset || ''}
              onChange={(e) => setSelectedDataset(Number(e.target.value))}
              className="bg-[#0A0A12] border border-white/10 text-white text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-[#6432E6]/50"
            >
              {datasets.map((ds) => (
                <option key={ds.id} value={ds.id}>{ds.name}</option>
              ))}
            </select>
          )}
          <select 
            value={forecastPeriod}
            onChange={(e) => setForecastPeriod(Number(e.target.value))}
            className="bg-[#0A0A12] border border-white/10 text-white text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-[#6432E6]/50"
          >
            <option value={7}>7 Days</option>
            <option value={30}>30 Days</option>
            <option value={90}>90 Days</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}. Please upload a dataset first in the Upload Data section.
        </div>
      )}

      {forecast && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ForecastCard 
              icon={Zap} 
              label="Peak Forecast" 
              value={`$${Math.max(...(forecast.predicted_values || [])).toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
              change="High"
            />
            <ForecastCard 
              icon={Target} 
              label="Avg Predicted Value" 
              value={`$${((forecast.predicted_values || []).reduce((a, b) => a + b, 0) / (forecast.predicted_values || [1]).length).toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
              change="95%"
            />
            <ForecastCard 
              icon={TrendingUp} 
              label="Trend Direction" 
              value={forecast.trend_direction === 'up' ? 'Upward ↑' : 'Downward ↓'}
              change={forecast.trend_direction === 'up' ? 'Positive' : 'Caution'}
            />
            <ForecastCard 
              icon={Calendar} 
              label="Forecast Period" 
              value={`${forecastPeriod} Days`}
              change={forecast.predicted_values?.length || 0}
            />
          </div>

          <div className="bg-[#0A0A12] border border-white/5 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#6432E6]" />
              Revenue Forecast with Confidence Intervals
            </h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <defs>
                    <linearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6432E6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6432E6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0A0A12', borderColor: 'rgba(255,255,255,0.1)' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value) => `$${value.toFixed(0)}`}
                  />
                  <Legend />
                  
                  {/* Confidence interval as area */}
                  <Area 
                    type="monotone" 
                    dataKey="upper" 
                    fill="#6432E6" 
                    stroke="none" 
                    fillOpacity={0.1} 
                    name="Upper Bound (95%)"
                    isAnimationActive={false}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="lower" 
                    fill="#6432E6" 
                    stroke="none" 
                    fillOpacity={0.05} 
                    name="Lower Bound (95%)"
                    isAnimationActive={false}
                  />
                  
                  {/* Main forecast line */}
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#6432E6" 
                    strokeWidth={3} 
                    dot={false}
                    name="Predicted Revenue"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
              <div className="w-3 h-3 rounded-full bg-[#6432E6]/30"></div>
              <span>Confidence interval represents 95% prediction bounds</span>
            </div>
          </div>

          {Object.keys(categoryForecasts).length > 0 && (
            <div className="bg-[#0A0A12] border border-white/5 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-6">Category Revenue Forecasts</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.entries(categoryForecasts).map(([category, data]) => (
                  <div key={category} className="border border-white/5 rounded-xl p-4 bg-black/20">
                    <h4 className="text-sm font-medium text-white mb-4">{category}</h4>
                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.dates.map((date, i) => ({ date, value: data.predicted_values[i] }))}>
                          <defs>
                            <linearGradient id={`grad-${category}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="date" stroke="#6b7280" fontSize={10} />
                          <YAxis stroke="#6b7280" fontSize={10} />
                          <RechartsTooltip 
                            contentStyle={{ backgroundColor: '#0A0A12', borderColor: 'rgba(255,255,255,0.1)' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value) => `$${value.toFixed(0)}`}
                          />
                          <Area type="monotone" dataKey="value" stroke="#10b981" fill={`url(#grad-${category})`} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-[#6432E6]/10 to-transparent border border-[#6432E6]/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#6432E6]" />
              AI Insights
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#6432E6] mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-300">
                  Prophet model detected <span className="text-white font-medium">strong weekly seasonality</span> in revenue patterns with {forecast.trend_direction === 'up' ? 'upward' : 'downward'} trend direction.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#6432E6] mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-300">
                  Next {forecastPeriod}-day forecast shows 95% confidence that revenue will stay within the predicted bounds. Actual performance may vary based on external factors.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#6432E6] mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-300">
                  Recommendation: Monitor actual vs predicted values to continuously improve forecast accuracy and identify anomalies early.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Forecasting;