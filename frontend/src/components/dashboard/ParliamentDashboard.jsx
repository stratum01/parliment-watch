import React, { useState, useEffect } from 'react';
// Import styling directly to ensure it's included
import '../../index.css';
import VoteCard from './VoteCard';
import { BillsList, BillStatusOverview } from '../bills';
import { MemberProfile, MemberSearch, VotingHistory } from '../members';
// Import our custom hooks for API data
import useVotes from '../../hooks/useVotes';
import useBills from '../../hooks/useBills';
import useMembers from '../../hooks/useMembers';
// Import the pagination component
import Pagination from '../shared/Pagination';
// Import the debug tools
import ApiDebugPanel from '../../hooks/ApiDebugPanel';


const SimpleTabs = ({ children, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  // Make sure selectedMember is scoped to this component, not referenced from parent
  const [selectedMember, setSelectedMember] = useState(null);
  
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
          <div className="space-y-6">
            {selectedMember ? (
              <div>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="mb-4 inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Members
                </button>
                <div className="grid grid-cols-1 gap-6">
                  <MemberProfile member={selectedMember} />
                  {/* Pass memberId to VotingHistory */}
                  <VotingHistory memberId={selectedMember.id} />
                </div>
              </div>
            ) : (
              <MemberSearch onMemberSelect={setSelectedMember} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Main Dashboard Component
const ParliamentDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Add state for debug panel
  const [showDebugger, setShowDebugger] = useState(false);
  const [displayCount, setDisplayCount] = useState(3);
  const { 
    votes, 
    loading: votesLoading, 
    error: votesError,
    pagination,
    goToPage,
    goToNextPage,
    goToPreviousPage
  } = useVotes();

  // Use real votes data from useVotes hook
  useEffect(() => {
    if (!votesLoading) {
      setLoading(false);
    }
    if (votesError) {
      setError(votesError);
    }
  }, [votesLoading, votesError]);

  const filteredVotes = votes?.filter(vote => 
    vote.description?.en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(vote.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

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
          <div>
            {/* Display only first 3 votes initially */}
            {filteredVotes.slice(0, displayCount).map(vote => (
              <VoteCard key={vote.id || vote.number} vote={vote} />
            ))}
      
            {/* Load More Button */}
            {filteredVotes.length > displayCount && (
              <div className="text-center mt-4 mb-2">
                <button 
                  onClick={() => setDisplayCount(prev => prev + 3)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Load More Votes
                </button>
              </div>
            )}
      
            {/* Pagination if needed */}
            {pagination && pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={(page) => {
                  goToPage(page);
                  setDisplayCount(3); // Reset display count when changing pages
                }}
                hasNext={pagination.hasNext}
                hasPrevious={pagination.hasPrevious}
              />
            )}
          </div>
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
      
      {/* Debug panel and button */}
      {showDebugger && <ApiDebugPanel onClose={() => setShowDebugger(false)} />}
      
      {/* Add debug button - fixed position at bottom right */}
      <button 
        onClick={() => setShowDebugger(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-md text-sm z-10"
      >
        Debug API
      </button>
    </div>
  );
};

export default ParliamentDashboard;