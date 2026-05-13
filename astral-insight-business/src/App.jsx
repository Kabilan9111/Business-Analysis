import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BusinessLayout from './components/BusinessLayout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Sales from './pages/Sales';
import Customers from './pages/Customers';
import Forecasting from './pages/Forecasting';
import Reports from './pages/Reports';
import AIAssistant from './pages/AIAssistant';
import AIInsights from './pages/AIInsights';
import Settings from './pages/Settings';
import UploadData from './pages/UploadData';
import AnomalyDetection from './pages/AnomalyDetection';
import SentimentAnalysis from './pages/SentimentAnalysis';
import Recommendations from './pages/Recommendations';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/business/dashboard" replace />} />
        
        <Route path="/business" element={<BusinessLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="sales" element={<Sales />} />
          <Route path="customers" element={<Customers />} />
          <Route path="forecasting" element={<Forecasting />} />
          <Route path="reports" element={<Reports />} />
          <Route path="upload-data" element={<UploadData />} />
          <Route path="ai-assistant" element={<AIAssistant />} />
          <Route path="ai-insights" element={<AIInsights />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="sentiment-analysis" element={<SentimentAnalysis />} />
          <Route path="anomaly-detection" element={<AnomalyDetection />} />
          <Route path="admin" element={<AdminPanel />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;