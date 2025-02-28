import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import ParliamentDashboard from './components/dashboard/ParliamentDashboard';
import BillDetails from './components/bills/BillDetails';
import VoteDetails from './components/votes/VoteDetails';
import AppHeader from './components/shared/AppHeader';
import AppFooter from './components/shared/AppFooter';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppHeader />
        
        <main className="flex-grow py-6">
          <Routes>
            <Route path="/" element={<ParliamentDashboard initialTab="overview" />} />
            <Route path="/bills" element={<ParliamentDashboard initialTab="bills" />} />
            <Route path="/bills/:billId" element={<BillDetails />} />
            <Route path="/votes" element={<ParliamentDashboard initialTab="overview" />} />
            <Route path="/votes/:voteId" element={<VoteDetails />} />
            <Route path="/members" element={<ParliamentDashboard initialTab="members" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <AppFooter />
      </div>
    </BrowserRouter>
  );
}

export default App;