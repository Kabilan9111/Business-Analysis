import React, { useState, useEffect, useRef } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  Legend, ResponsiveContainer, AreaChart, Area, ComposedChart, Bar,
  BarChart, ScatterChart, Scatter, ZAxis, PieChart, Pie, Cell,
  ReferenceLine, ReferenceDot
} from 'recharts';
import { 
  Brain, TrendingUp, Calendar, Zap, Target, AlertCircle, Loader, 
  ChevronDown, Settings2, Sliders, Info, Box, RefreshCw, BarChart2,
  TrendingDown, Download, Share2, MessageSquare, ShieldAlert,
  Search, Filter, CheckCircle2, ChevronRight, Activity, Users,
  ShoppingCart, ArrowRight, Gauge, Layers, Terminal, Sparkles, 
  Send, MapPin, Clock, Server, ArrowDownRight, ArrowUpRight, Crosshair,
  BadgeAlert, FileText, LayoutDashboard, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// MOCK DATA & CONSTANTS
// ============================================================================
const API_BASE = 'http://localhost:3001/api';
const COLORS = ['#6432E6', '#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];
const UI_BG = '#0A0A12';

// 1. BASE FORECAST DATA (Prophet output mapping)
const generateForecastSeries = (days, baseVal, volatility) => {
  const data = [];
  let currentVal = baseVal;
  const now = new Date();
  for (let i = 0; i < days; i++) {
    now.setDate(now.getDate() + 1);
    const dateStr = now.toISOString().split('T')[0];
    const trend = 1 + (Math.random() * volatility - (volatility / 2.2));
    currentVal = currentVal * trend;
    const seasonality = 1 + Math.sin(i / 7) * 0.05;
    const finalVal = currentVal * seasonality;
    
    data.push({
      date: dateStr,
      predicted: Math.round(finalVal),
      lower: Math.round(finalVal * 0.92),
      upper: Math.round(finalVal * 1.08),
      actual: i < 7 ? Math.round(finalVal * (1 + (Math.random() * 0.04 - 0.02))) : null,
      anomaly: i === 4 || i === 12 || i === 22 ? Math.round(finalVal * 1.2) : null
    });
  }
  return data;
};

const MOCK_SERIES = {
  30: generateForecastSeries(30, 85000, 0.04)
};

// 4. EXPLAINABILITY DATA (Waterfall impact simulation)
const EXPLAINABILITY_DATA = [
  { name: 'Base', value: 85000, type: 'base' },
  { name: 'Seasonality', value: 12500, type: 'positive' },
  { name: 'Ad Campaign', value: 18200, type: 'positive' },
  { name: 'Competitor', value: -5400, type: 'negative' },
  { name: 'Supply Chain', value: -3200, type: 'negative' },
  { name: 'Predicted', value: 107100, type: 'total' }
];

// 8. MODEL COMPARISON
const MODELS = [
  { name: 'LSTM (Deep Learning)', accuracy: 96.4, latency: '420ms', status: 'Active Champion', color: '#6432E6' },
  { name: 'Prophet (Meta)', accuracy: 93.8, latency: '120ms', status: 'Shadow Challenger', color: '#10b981' },
  { name: 'XGBoost', accuracy: 91.2, latency: '85ms', status: 'Offline', color: '#3b82f6' },
  { name: 'ARIMA', accuracy: 84.5, latency: '45ms', status: 'Offline', color: '#f59e0b' }
];

// 11. FUNNEL CONVERSION
const FUNNEL_DATA = [
  { name: 'Traffic', current: 154000, predicted: 182000 },
  { name: 'Product View', current: 85000, predicted: 105000 },
  { name: 'Add to Cart', current: 32000, predicted: 41000 },
  { name: 'Checkout', current: 18000, predicted: 24500 },
  { name: 'Purchase', current: 12400, predicted: 18200 }
];

// ============================================================================
// COMPONENTS
// ============================================================================

const PremiumCard = ({ children, className = "", glowing = false }) => (
  <div className={`relative group ${className}`}>
    {glowing && (
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6432E6] to-[#ec4899] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
    )}
    <div className="relative h-full bg-[#0A0A12] border border-white/5 rounded-2xl p-6 overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 p-32 bg-[#6432E6] opacity-[0.02] blur-3xl rounded-full mix-blend-screen pointer-events-none"></div>
      {children}
    </div>
  </div>
);

const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-white/10 text-gray-300',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/20',
    purple: 'bg-[#6432E6]/20 text-[#a78bfa] border border-[#6432E6]/30',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function Forecasting() {
  const [loading, setLoading] = useState(false);
  const [forecastPeriod, setForecastPeriod] = useState(30);
  
  // Scenarios
  const [adSpend, setAdSpend] = useState(0);
  const [conversionBoost, setConversionBoost] = useState(0);
  const [trafficSpike, setTrafficSpike] = useState(0);
  
  // Copilot Chat
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: 'I am your Forecasting Copilot. I\'ve analyzed 50,000+ records. What would you like to simulate or understand today?' }
  ]);
  const [chatMsg, setChatMsg] = useState("");

  const chatEndRef = useRef(null);
  
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  const handleChat = (e) => {
    e.preventDefault();
    if (!chatMsg.trim()) return;
    setChatMessages([...chatMessages, { role: 'user', text: chatMsg }]);
    const query = chatMsg;
    setChatMsg("");
    setTimeout(() => {
      let reply = "Based on our LSTM model, changes to that variable will shift the 30-day revenue expectation by ~4.2% and slightly increase stockout risks in the APAC region.";
      if (query.toLowerCase().includes("inventory")) reply = "Dead stock is currently costing roughly $18k/month. I recommend discounting the 'Legacy SaaS Sub' to liquidate.";
      if (query.toLowerCase().includes("traffic")) reply = "A 20% traffic spike without conversion optimization will likely just increase infrastructure costs by $1.2k while only boosting revenue by 3%. Focus on funnel optimization first.";
      setChatMessages(prev => [...prev, { role: 'ai', text: reply }]);
    }, 1200);
  };

  // Scenario Multiplier Application
  const scenarioMultiplier = 1 + (adSpend * 0.005) + (conversionBoost * 0.015) + (trafficSpike * 0.008);
  const dynamicSeries = MOCK_SERIES[30].map(d => ({
    ...d,
    predicted: Math.round(d.predicted * scenarioMultiplier),
    bestCase: Math.round(d.upper * scenarioMultiplier * 1.05),
    worstCase: Math.round(d.lower * scenarioMultiplier * 0.95),
  }));

  const predictedPeak = Math.max(...dynamicSeries.map(d => d.predicted));
  const avgPredicted = dynamicSeries.reduce((sum, d) => sum + d.predicted, 0) / dynamicSeries.length;

  return (
    <div className="bg-[#050508] min-h-screen pb-24 text-gray-200 selection:bg-[#6432E6]/30">
      
      {/* 9. ADVANCED FORECAST FILTERING & 13. EXECUTIVE REPORTING */}
      <div className="sticky top-0 z-40 bg-[#050508]/80 backdrop-blur-xl border-b border-white/5 px-8 py-4">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-[#6432E6]/20 rounded-xl border border-[#6432E6]/30 shadow-[0_0_15px_rgba(100,50,230,0.5)]">
              <Sparkles className="w-6 h-6 text-[#a78bfa]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                Predictive Intelligence
                <Badge variant="purple">LSTM Champion Model</Badge>
              </h1>
              <p className="text-sm text-gray-400">Enterprise AI forecasting engine powered by massive-scale data</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm">
              <Globe className="w-4 h-4 text-gray-400" />
              <span>Global Data</span>
              <ChevronDown className="w-3 h-3 text-gray-500" />
            </div>
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm">
              <Users className="w-4 h-4 text-gray-400" />
              <span>All Segments</span>
              <ChevronDown className="w-3 h-3 text-gray-500" />
            </div>
            
            <div className="h-6 w-px bg-white/10 mx-2"></div>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors rounded-lg text-sm font-medium">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#6432E6] hover:bg-[#5222c9] text-white transition-colors rounded-lg text-sm font-medium shadow-[0_0_15px_rgba(100,50,230,0.4)]">
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-[1600px] mx-auto space-y-6">
        
        {/* TOP ROW: ACCURACY, SUMMARY KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PremiumCard glowing>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-400 font-medium mb-1">Projected Total Revenue</p>
                <h3 className="text-3xl font-bold text-white">${(avgPredicted * 30).toLocaleString()}</h3>
              </div>
              <div className="p-2.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium">
              <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">+14.2%</span>
              <span className="text-gray-500">vs historical baseline</span>
            </div>
          </PremiumCard>

          {/* 1. FORECAST ACCURACY ENGINE */}
          <PremiumCard>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-400 font-medium mb-1">Forecast Accuracy</p>
                <h3 className="text-3xl font-bold text-white">96.4%</h3>
              </div>
              <div className="p-2.5 bg-[#6432E6]/10 rounded-lg border border-[#6432E6]/30">
                <Target className="w-5 h-5 text-[#a78bfa]" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="bg-white/5 rounded p-1.5">
                <p className="text-[10px] text-gray-500">MAPE</p>
                <p className="text-xs font-mono text-gray-300">4.2%</p>
              </div>
              <div className="bg-white/5 rounded p-1.5">
                <p className="text-[10px] text-gray-500">RMSE</p>
                <p className="text-xs font-mono text-gray-300">1.2k</p>
              </div>
              <div className="bg-white/5 rounded p-1.5">
                <p className="text-[10px] text-gray-500">MAE</p>
                <p className="text-xs font-mono text-gray-300">0.9k</p>
              </div>
            </div>
          </PremiumCard>

          <PremiumCard>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-400 font-medium mb-1">Peak Forecast Day</p>
                <h3 className="text-3xl font-bold text-white">${predictedPeak.toLocaleString()}</h3>
              </div>
              <div className="p-2.5 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <div className="flex-1 bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-amber-300 h-full w-[85%] rounded-full"></div>
              </div>
              <span className="text-xs text-gray-400 font-mono">Day 22</span>
            </div>
          </PremiumCard>

          <PremiumCard>
            <div className="flex flex-col h-full justify-between">
              <div className="flex justify-between items-start">
                <p className="text-sm text-gray-400 font-medium">Model Stability</p>
                <Badge variant="success">Optimal</Badge>
              </div>
              <div className="py-2">
                <h3 className="text-xl font-medium text-emerald-400 pb-1">Highly Reliable</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Model accuracy improved 12% over the last 30 days due to stable purchasing patterns.</p>
              </div>
            </div>
          </PremiumCard>
        </div>

        {/* MIDDLE TWO COLUMNS: SCENARIOS & MAIN CHART */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* 2. WHAT-IF SCENARIO SIMULATOR */}
          <PremiumCard className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#6432E6]" />
              Scenario Simulator
            </h3>
            <p className="text-xs text-gray-400 mb-6">Real-time what-if forecasting</p>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Ad Spend</span>
                  <span className="text-[#a78bfa] font-mono">+{adSpend}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={adSpend} 
                  onChange={(e) => setAdSpend(Number(e.target.value))}
                  className="w-full accent-[#6432E6] bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Conv. Optimization</span>
                  <span className="text-emerald-400 font-mono">+{conversionBoost}%</span>
                </div>
                <input 
                  type="range" min="0" max="50" value={conversionBoost} 
                  onChange={(e) => setConversionBoost(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: '#10b981' }}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Traffic Spike</span>
                  <span className="text-blue-400 font-mono">+{trafficSpike}%</span>
                </div>
                <input 
                  type="range" min="0" max="200" step="10" value={trafficSpike} 
                  onChange={(e) => setTrafficSpike(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: '#3b82f6' }}
                />
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between items-center bg-[#6432E6]/10 border border-[#6432E6]/20 rounded-xl p-3">
                  <span className="text-sm font-medium text-gray-200">Profit Impact</span>
                  <span className="text-emerald-400 font-bold font-mono">
                    +${Math.round(adSpend * 120 + conversionBoost * 450 + trafficSpike * 80).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </PremiumCard>

          {/* MAIN REVENUE FORECAST + ANOMALY INDICATORS */}
          <PremiumCard className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <BarChart2 className="w-6 h-6 text-[#6432E6]" />
                  Revenue Forecast & Anomaly Detection
                </h3>
                <p className="text-sm text-gray-400">95% Confidence Interval with AI Anomaly Highlights</p>
              </div>
              <div className="flex gap-2">
                <Badge variant="default">Base</Badge>
                <Badge variant="purple">Best Case</Badge>
                <Badge variant="warning">Anomalies</Badge>
              </div>
            </div>

            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={dynamicSeries} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="forFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6432E6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6432E6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="bestFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={11} tickMargin={10} minTickGap={30} />
                  <YAxis stroke="#6b7280" fontSize={11} tickFormatter={v => `$${v/1000}k`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#050508', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#fff', fontSize: '13px' }}
                    labelStyle={{ color: '#9ca3af', marginBottom: '8px', fontSize: '12px' }}
                    formatter={(val, name) => [`$${val.toLocaleString()}`, name]}
                  />
                  
                  {/* Bounds */}
                  <Area type="monotone" dataKey="bestCase" fill="url(#bestFill)" stroke="none" name="Best Case Simulation" isAnimationActive={false} />
                  <Area type="monotone" dataKey="worstCase" fill="transparent" stroke="none" isAnimationActive={false} />
                  <Area type="monotone" dataKey="upper" fill="#6432E6" fillOpacity={0.05} stroke="none" name="Statistical Upper" isAnimationActive={false} />
                  
                  {/* Lines */}
                  <Line type="monotone" dataKey="predicted" stroke="#6432E6" strokeWidth={3} dot={false} name="Expected Forecast" />
                  <Line type="monotone" dataKey="actual" stroke="#9ca3af" strokeDasharray="5 5" strokeWidth={2} dot={true} name="Actual (Historical)" />

                  {/* 7. AI ANOMALY DETECTION ENGINE */}
                  <Scatter dataKey="anomaly" fill="#f43f5e" name="Detected AI Anomaly">
                    {dynamicSeries.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#f43f5e" />
                    ))}
                  </Scatter>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </PremiumCard>
        </div>

        {/* BOTTOM GRID: Explainability, Models, Copilot, alerts etc. */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* 4. FORECAST EXPLAINABILITY ENGINE */}
          <PremiumCard>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#3b82f6]" />
              Forecast Drivers (Waterfall)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={EXPLAINABILITY_DATA} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                  <XAxis type="number" stroke="#6b7280" fontSize={10} tickFormatter={v => `$${v/1000}k`} />
                  <YAxis dataKey="name" type="category" stroke="#d1d5db" fontSize={11} width={80} />
                  <RechartsTooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#050508', border: 'none' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {EXPLAINABILITY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={
                        entry.type === 'base' ? '#6b7280' : 
                        entry.type === 'positive' ? '#10b981' : 
                        entry.type === 'negative' ? '#f43f5e' : '#6432E6'
                      } />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-400 mt-4 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
              <span className="text-[#a78bfa] font-semibold">AI Note:</span> Revenue forecast increased primarily due to highly successful ad campaigns (+18k) counteracting severe supply chain delays (-3.2k).
            </p>
          </PremiumCard>

          {/* 11. CONVERSION & FUNNEL FORECASTING */}
          <PremiumCard>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              Predictive Funnel Leakage
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={FUNNEL_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={10} />
                  <YAxis stroke="#6b7280" fontSize={10} tickFormatter={v => `${v/1000}k`} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#0A0A12', border: '1px solid rgba(255,255,255,0.1)' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="current" name="Current Trajectory" fill="#374151" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="predicted" name="AI Optimized Forecast" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </PremiumCard>

          {/* 6. FORECAST ALERT SYSTEM & 3. INVENTORY */}
          <div className="space-y-6">
            <PremiumCard className="!p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-fuchsia-500" />
                Critical Intelligence Alerts
              </h3>
              <div className="space-y-3">
                <div className="flex gap-3 bg-red-500/10 border border-red-500/20 p-3 rounded-xl items-start">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0 animate-pulse"></div>
                  <div>
                    <h4 className="text-xs font-semibold text-red-200">Imminent Stockout Risk</h4>
                    <p className="text-[11px] text-red-300/80 mt-1">Enterprise Server License quota depleting in 4 days. Restock recommended.</p>
                  </div>
                </div>
                <div className="flex gap-3 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl items-start">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-xs font-semibold text-emerald-200">Abnormal Demand Spike</h4>
                    <p className="text-[11px] text-emerald-300/80 mt-1">SaaS Subscriptions up 400% in India region since 12:00 UTC.</p>
                  </div>
                </div>
                <div className="flex gap-3 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl items-start">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-xs font-semibold text-amber-200">Conversion Drop Detected</h4>
                    <p className="text-[11px] text-amber-300/80 mt-1">Checkout abandonment rose 12% in the last hour. Investigating payment gateway latency.</p>
                  </div>
                </div>
              </div>
            </PremiumCard>
          </div>

        </div>

        {/* 8. MULTI-MODEL FORECASTING COMPARISON & 5. AI RECOMMENDATIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <PremiumCard>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Server className="w-5 h-5 text-gray-400" />
              Machine Learning Lab (Auto-Selection)
            </h3>
            <div className="space-y-4">
              {MODELS.map((model, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg" style={{ backgroundColor: `${model.color}20`, color: model.color }}>
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{model.name}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">Latency: {model.latency}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white group-hover:text-[#a78bfa] transition">{model.accuracy}%</div>
                    <div className="text-[10px] font-medium px-2 py-0.5 bg-white/10 rounded-full mt-1 inline-block text-gray-300">
                      {model.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>

          <PremiumCard>
            <div className="h-full flex flex-col">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#6432E6]" />
                Prescriptive Actions (AI Recommendations)
              </h3>
              
              <div className="space-y-4 flex-1">
                {[
                  { title: "Optimize Pricing Strategy", desc: "Increase Tier 1 SaaS pricing by 5%. Historical elasticity models predict a +8% net MRR gain with negligible churn impact.", impact: "+$12.5k / mo", type: "Revenue" },
                  { title: "Targeted Churn Intervention", desc: "42 Enterprise accounts show early decay signals. Dispatch automated 15% discount SLA renewals immediately.", impact: "Save $45k LTV", type: "Retention" },
                  { title: "Shift Ad Spend to APAC", desc: "CAC in APAC is currently 40% lower than NA with equal LTV. Reallocating $10k ad budget will yield highest ROI.", impact: "+24% ROI", type: "Marketing" }
                ].map((rec, i) => (
                  <div key={i} className="relative overflow-hidden p-5 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-xl group hover:border-[#6432E6]/50 transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-bold text-white group-hover:text-[#a78bfa] transition-colors">{rec.title}</h4>
                      <Badge variant="purple">{rec.impact}</Badge>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed pr-8">{rec.desc}</p>
                    <ArrowRight className="absolute bottom-4 right-4 w-4 h-4 text-gray-600 group-hover:text-[#a78bfa] transition-all transform group-hover:translate-x-1" />
                  </div>
                ))}
              </div>
            </div>
          </PremiumCard>

        </div>

      </div>

      {/* 12. AI FORECASTING COPILOT (Floating Chat) */}
      <AnimatePresence>
        {chatOpen ? (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] bg-[#050508]/95 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(100,50,230,0.15)] rounded-2xl overflow-hidden z-50 flex flex-col"
            style={{ height: '480px' }}
          >
            {/* Chat header */}
            <div className="px-4 py-3 bg-[#6432E6]/10 border-b border-white/10 flex justify-between items-center cursor-pointer" onClick={() => setChatOpen(false)}>
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#a78bfa]" />
                <span className="font-semibold text-white text-sm">Forecast Copilot</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm scrollbar-hide">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-xl px-4 py-3 leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[#6432E6] text-white rounded-br-none shadow-[0_0_15px_rgba(100,50,230,0.3)]' 
                      : 'bg-white/5 text-gray-300 border border-white/10 rounded-bl-none'
                  }`}>
                    {msg.role === 'ai' && <Sparkles className="w-3 h-3 text-[#a78bfa] mb-2" />}
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input area */}
            <form onSubmit={handleChat} className="p-3 bg-black/40 border-t border-white/10">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={chatMsg}
                  onChange={e => setChatMsg(e.target.value)}
                  placeholder="Ask a predictive question..." 
                  className="w-full bg-[#0A0A12] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-[#6432E6] transition-colors"
                />
                <button type="submit" disabled={!chatMsg.trim()} className="absolute right-2 p-1.5 text-gray-400 hover:text-white disabled:opacity-50 transition-colors bg-[#6432E6] rounded-lg">
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <button 
              onClick={() => setChatOpen(true)}
              className="bg-[#6432E6] hover:bg-[#5222c9] text-white p-4 rounded-full shadow-[0_0_30px_rgba(100,50,230,0.6)] flex items-center justify-center transition-all group"
            >
              <MessageSquare className="w-6 h-6" />
              <div className="absolute top-0 right-0 w-3 h-3 bg-pink-500 rounded-full border-2 border-[#050508]"></div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
