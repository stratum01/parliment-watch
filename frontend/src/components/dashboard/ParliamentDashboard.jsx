import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import SearchControls from '@/components/shared/SearchControls';
import VoteCard from './VoteCard';
import WordCloud from './WordCloud';
import { BillsList, BillStatusOverview } from '@/components/bills';
import { MemberProfile, VotingHistory, MemberSearch } from '@/components/members';
import { useVotes } from '@/hooks/useVotes';
import { Calendar, Filter } from 'lucide-react';

const ParliamentDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const { votes, loading: votesLoading, error: votesError } = useVotes();

  const filteredVotes = votes.filter(vote => 
    vote.description.en.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDateChange = (range) => {
    setDateRange(range);
    // In a real implementation, you would pass this to your useVotes hook
    console.log('Date range selected:', range);
  };

  const handleFilterClick = () => {
    // Implement advanced filtering here
    console.log('Filter clicked');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setDateRange({ from: null, to: null });
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:w-2/3">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input 
                id="search"
                type="search" 
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search bills and motions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex space-x-2 w-full md:w-1/3 justify-end">
            <button 
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleFilterClick}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
            
            <button 
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Date Range
            </button>
            
            {(searchQuery || dateRange.from || dateRange.to) && (
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="bg-white rounded-lg shadow-sm p-4">
        <TabsList className="mb-4 flex border-b">
          <TabsTrigger value="overview" className="px-4 py-2 font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap pb-4 border-b-2 border-transparent">
            Overview
          </TabsTrigger>
          <TabsTrigger value="bills" className="px-4 py-2 font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap pb-4 border-b-2 border-transparent">
            Bills
          </TabsTrigger>
          <TabsTrigger value="members" className="px-4 py-2 font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap pb-4 border-b-2 border-transparent">
            Members
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="py-2">
          <div className="space-y-6">
            {votesLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : votesError ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{votesError}</span>
              </div>
            ) : filteredVotes.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No votes found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try changing your search query or filters.
                </p>
              </div>
            ) : (
              filteredVotes.map(vote => (
                <VoteCard key={vote.id || vote.number} vote={vote} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="bills" className="py-2">
          <div className="space-y-6">
            <BillStatusOverview />
            <BillsList />
          </div>
        </TabsContent>

        <TabsContent value="members" className="py-2">
          {!selectedMember ? (
            <MemberSearch onMemberSelect={setSelectedMember} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <MemberProfile member={selectedMember} />
              </div>
              <div className="md:col-span-2">
                <VotingHistory memberId={selectedMember.id} />
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Word Cloud Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Trending Topics in Parliament</h2>
        <WordCloud />
      </div>
    </div>
  );
};

export default ParliamentDashboard;