import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import SearchControls from '@/components/shared/SearchControls';
import VoteCard from './VoteCard';
import WordCloud from './WordCloud';
import { BillStatusOverview, BillsList } from '@/components/bills';
import { MemberProfile, VotingHistory, MemberSearch } from '@/components/members';
import { useVotes } from '@/hooks/useVotes';

const ParliamentDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const { votes, loading: votesLoading } = useVotes();

  const filteredVotes = votes.filter(vote => 
    vote.description.en.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDateChange = (date) => {
    // TODO: Implement date filtering
    console.log('Date selected:', date);
  };

  const handleFilterClick = () => {
    // TODO: Implement advanced filtering
    console.log('Filter clicked');
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      {/* Search and Filter Bar */}
      <SearchControls
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterClick={handleFilterClick}
        onDateChange={handleDateChange}
        placeholder="Search bills and motions..."
      />

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bills">Bills</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-4">
            {votesLoading ? (
              <div>Loading votes...</div>
            ) : (
              filteredVotes.map(vote => (
                <VoteCard key={vote.number} vote={vote} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="bills">
          <div className="space-y-4">
            <BillStatusOverview />
            <BillsList />
          </div>
        </TabsContent>

        <TabsContent value="members">
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
      <div className="mt-12 bg-gray-50 rounded-xl border">
        <h2 className="text-lg font-semibold px-6 pt-6">Trending Topics in Parliament</h2>
        <WordCloud />
      </div>
    </div>
  );
};

export default ParliamentDashboard;