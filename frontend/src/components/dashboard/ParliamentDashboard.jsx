import React, { useState } from 'react';
import { useVotes } from '../../hooks/useVotes';

// Simple inline components to avoid import issues
const SimpleVoteCard = ({ vote }) => {
  if (!vote) return null;
  
  const { number, date, description, result, yea_total, nay_total } = vote;
  
  const formattedDate = new Date(date).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 mb-4">
      <div className="flex justify-between mb-2">
        <h3 className="text-lg font-semibold">
          Vote #{number}
          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
            result === 'Passed' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {result}
          </span>
        </h3>
        <div className="text-sm text-gray-500">{formattedDate}</div>
      </div>
      <p className="text-gray-700">{description?.en || description}</p>
      
      <div className="flex mt-4 justify-between">
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">{yea_total}</div>
          <div className="text-sm text-gray-600">Yea</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-red-600">{nay_total}</div>
          <div className="text-sm text-gray-600">Nay</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold">{yea_total + nay_total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
      </div>
    </div>
  );
};

const SimpleWordCloud = () => (
  <div className="p-4 bg-gray-50 rounded-lg border">
    <h2 className="text-lg font-semibold mb-4">Trending Topics in Parliament</h2>
    <div className="flex flex-wrap justify-center gap-3 py-6">
      {["united states", "international trade", "softwood lumber", "economic statement", 
        "healthcare", "budget", "environment", "COVID-19", "inflation", "housing"].map((word, i) => (
        <span 
          key={i} 
          className={`text-${Math.floor(Math.random() * 3) + 1}xl text-blue-${Math.floor(Math.random() * 4) + 5}00 font-medium px-2`}
        >
          {word}
        </span>
      ))}
    </div>
  </div>
);

const SimpleTabs = ({ children, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 ${activeTab === 'overview' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'bills' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('bills')}
        >
          Bills
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'members' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('members')}
        >
          Members
        </button>
      </div>
      
      <div className="py-2">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {children}
          </div>
        )}
        
        {activeTab === 'bills' && (
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium">Bills Section</h3>
            <p className="text-gray-600 mt-2">Bills tracking functionality coming soon.</p>
          </div>
        )}
        
        {activeTab === 'members' && (
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium">Members Section</h3>
            <p className="text-gray-600 mt-2">MP profiles and voting records coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Dashboard Component
const ParliamentDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { votes, loading, error } = useVotes();

  const filteredVotes = votes.filter(vote => 
    vote.description?.en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(vote.description).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative rounded-md shadow-sm">
          <input
            type="text"
            className="block w-full rounded-md border-0 py-3 pl-4 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
            placeholder="Search votes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <SimpleTabs defaultTab="overview">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            <p>Error loading votes: {error}</p>
          </div>
        ) : filteredVotes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No votes found. Try adjusting your search.</p>
          </div>
        ) : (
          filteredVotes.map(vote => (
            <SimpleVoteCard key={vote.id || vote.number} vote={vote} />
          ))
        )}
      </SimpleTabs>

      {/* Word Cloud */}
      <div className="mt-6">
        <SimpleWordCloud />
      </div>
    </div>
  );
};

export default ParliamentDashboard;