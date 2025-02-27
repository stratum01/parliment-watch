import React from 'react';
import ParliamentDashboard from './components/dashboard/ParliamentDashboard';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Parliament Watch</h1>
              <p className="text-sm text-gray-500">Tracking Parliamentary Activities</p>
            </div>
            <nav className="hidden md:flex space-x-4">
              <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
              <a href="#help" className="text-gray-600 hover:text-gray-900">Help</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <ParliamentDashboard />
      </main>

      <footer className="bg-white border-t mt-12 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="md:w-1/3">
              <h3 className="font-semibold mb-3">About Parliament Watch</h3>
              <p className="text-sm text-gray-600">
                Tracking and analyzing parliamentary activities, votes, and legislation
                to promote transparency and engagement in democratic processes.
              </p>
            </div>
            <div className="md:w-1/3">
              <h3 className="font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#terms" className="text-gray-600 hover:text-gray-900">Terms of Service</a></li>
                <li><a href="#privacy" className="text-gray-600 hover:text-gray-900">Privacy Policy</a></li>
                <li><a href="#api" className="text-gray-600 hover:text-gray-900">API Documentation</a></li>
              </ul>
            </div>
            <div className="md:w-1/3">
              <h3 className="font-semibold mb-3">Connect</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#twitter" className="text-gray-600 hover:text-gray-900">Twitter</a></li>
                <li><a href="#github" className="text-gray-600 hover:text-gray-900">GitHub</a></li>
                <li><a href="#email" className="text-gray-600 hover:text-gray-900">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
            <p>&copy; {new Date().getFullYear()} Parliament Watch. All rights reserved.</p>
            <p className="mt-2">Powered by the awesome API data provided by <a href="https://openparliament.ca/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">OpenParliament.ca</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;