import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import InwardPage from './pages/InwardPage';
import LotDetailPage from './pages/LotDetailPage';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  return (
    <NotificationProvider> 
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/inward" element={<InwardPage />} />
          <Route path="/lots/:lotId" element={<LotDetailPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </Layout>
    </Router>
    </NotificationProvider>
  );
}

export default App;