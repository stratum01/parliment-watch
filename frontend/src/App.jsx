// src/App.jsx

import React from 'react';
import './index.css';
import ParliamentDashboard from './components/dashboard/ParliamentDashboard';
import AppHeader from './components/shared/AppHeader';
import AppFooter from './components/shared/AppFooter';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />
      
      <main className="flex-grow py-6">
        <ParliamentDashboard />
      </main>
      
      <AppFooter />
    </div>
  );
}

export default App;