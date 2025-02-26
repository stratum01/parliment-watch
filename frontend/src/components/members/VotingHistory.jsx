import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useMemberVotes } from '@/hooks/useMembers';

const VoteHistoryItem = ({ vote }) => (
  <div className="p-4 hover:bg-gray-50">
    <div className="flex justify-between items-start mb-2">
      <div>
        <h3 className="font-medium">{vote.bill || 'Motion'}</h3>
        <p className="text-sm text-gray-600">{vote.description}</p>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`px-2 py-1 text-sm rounded ${
          vote.vote === 'Yea' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {vote.vote}
        </span>
        <span className={`px-2 py-1 text-sm rounded ${
          vote.result === 'Passed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {vote.result}
        </span>
      </div>
    </div>
    <div className="text-sm text-gray-600">
      {vote.date}
    </div>
  </div>
);

const VotingHistory = ({ memberId }) => {
  const { votes, loading, error } = useMemberVotes(memberId);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 4;

  if (loading) return <div>Loading voting history...</div>;
  if (error) return <div>Error loading voting history: {error}</div>;

  const totalPages = Math.ceil(votes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedVotes = votes.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Recent Voting Record</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {displayedVotes.map((vote, index) => (
            <VoteHistoryItem key={index} vote={vote} />
          ))}
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between border-t p-4">
          <button 
            className="px-3 py-1 border rounded text-sm hover:bg-gray-50 disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
          <button 
            className="px-3 py-1 border rounded text-sm hover:bg-gray-50 disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      </CardContent>
    </Card>
  );
};