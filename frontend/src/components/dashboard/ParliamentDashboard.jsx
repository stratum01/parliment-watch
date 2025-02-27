import React, { useState, useEffect } from 'react';
// Import styling directly to ensure it's included
import '../../index.css';
import VoteCard from './VoteCard';
import { BillsList, BillStatusOverview } from '../bills';

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
          <div className="space-y-4">
            <BillStatusOverview />
            <BillsList />
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
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Directly fetch mock votes data
  useEffect(() => {
    const fetchVotes = async () => {
      try {
        setLoading(true);
        
        // Mock data - directly included to avoid import issues
        const mockVotes = [
          {
            id: "v1",
            number: 928,
            date: "2024-12-17",
            description: {
              en: "Motion on International Trade Agreement with United States",
              fr: "Motion sur l'accord commercial international avec les États-Unis"
            },
            result: "Passed",
            yea_total: 177,
            nay_total: 140,
            paired_total: 0,
            bill_url: null
          },
          {
            id: "v2",
            number: 927,
            date: "2024-12-17",
            description: {
              en: "Economic Statement Implementation Act",
              fr: "Loi d'exécution de l'énoncé économique"
            },
            result: "Passed",
            yea_total: 296,
            nay_total: 17,
            paired_total: 0,
            bill_url: "/bills/44-1/C-123/"
          },
          {
            id: "v3",
            number: 926,
            date: "2024-12-16",
            description: {
              en: "Motion on Softwood Lumber Industry Support",
              fr: "Motion sur le soutien à l'industrie du bois d'oeuvre"
            },
            result: "Failed",
            yea_total: 144,
            nay_total: 167,
            paired_total: 0,
            bill_url: "/bills/44-1/C-45/"
          },
          {
            id: "v4",
            number: 925,
            date: "2024-12-15",
            description: {
              en: "Climate Action Implementation Bill",
              fr: "Projet de loi sur la mise en œuvre de l'action climatique"
            },
            result: "Passed",
            yea_total: 189,
            nay_total: 132,
            paired_total: 0,
            bill_url: null
          }
        ];
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setVotes(mockVotes);
        setError(null);
      } catch (err) {
        console.error('Error fetching votes:', err);
        setError('Failed to load votes data.');
      } finally {
        setLoading(false);
      }
    };

    fetchVotes();
  }, []);

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
            <VoteCard key={vote.id || vote.number} vote={vote} />
          ))
        )}
      </SimpleTabs>

      {/* Word Cloud Section */}
      <div className="mt-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Trending Topics in Parliament</h2>
          <div className="py-6 px-4">
            <div className="flex flex-wrap justify-center items-center gap-2 text-center leading-none">
              {[
                { text: "united states", size: "text-3xl", color: "text-blue-600" },
                { text: "international trade", size: "text-2xl", color: "text-indigo-500" },
                { text: "softwood lumber", size: "text-2xl", color: "text-green-600" },
                { text: "economic statement", size: "text-xl", color: "text-purple-500" },
                { text: "healthcare", size: "text-xl", color: "text-red-500" },
                { text: "budget", size: "text-xl", color: "text-blue-500" },
                { text: "environment", size: "text-lg", color: "text-green-500" },
                { text: "COVID-19", size: "text-lg", color: "text-orange-500" },
                { text: "inflation", size: "text-base", color: "text-red-600" },
                { text: "housing", size: "text-base", color: "text-blue-600" }
              ].map((word, index) => (
                <span
                  key={index}
                  className={`${word.size} ${word.color} font-medium inline-block px-2`}
                >
                  {word.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParliamentDashboard;