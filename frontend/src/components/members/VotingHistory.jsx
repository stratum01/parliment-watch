import React, { useState, useEffect } from 'react';

const VotingHistory = ({ votes, memberId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [memberVotes, setMemberVotes] = useState([]);
  const itemsPerPage = 5;
  
  // Fetch votes if they're not provided directly
  useEffect(() => {
    const fetchVotes = async () => {
      if (votes) {
        setMemberVotes(votes);
        return;
      }
      
      if (!memberId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Extract member name from URL if it's a full URL
        const memberName = memberId.includes('/') 
          ? memberId.split('/').filter(Boolean).pop() 
          : memberId;
        
        console.log('Attempting to fetch votes for member:', memberName);
        
        // For now, let's just handle the error gracefully since the backend is returning 500
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'https://parliament-watch-api.fly.dev/api';
          const response = await fetch(`${apiUrl}/members/${memberName}/votes`);
          
          if (!response.ok) {
            console.warn(`Votes API returned status ${response.status} for member ${memberName}`);
            // Don't throw error, just continue with empty votes
            setMemberVotes([]);
            return;
          }
          
          const data = await response.json();
          console.log('Raw votes data:', data);
          
          // Extract votes from the API response
          const votesArray = data.objects || [];
          
          // Transform the votes data if needed
          const formattedVotes = votesArray.map(vote => ({
            id: vote.id || vote.url,
            bill: vote.bill_number || vote.bill?.number || 'Motion',
            description: typeof vote.description === 'object' ? vote.description.en : vote.description,
            date: vote.date,
            vote: vote.vote || (vote.ballot && vote.ballot === 1 ? 'Yea' : 'Nay'),
            result: vote.result || (vote.passed ? 'Passed' : 'Failed')
          }));
          
          setMemberVotes(formattedVotes);
        } catch (apiErr) {
          console.error('Error fetching votes from API:', apiErr);
          // Just set empty votes array instead of showing error
          setMemberVotes([]);
        }
      } catch (err) {
        console.error('Error in votes process:', err);
        setError('Could not retrieve voting history at this time.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVotes();
  }, [votes, memberId]);
  
  if (loading) {
    return (
      <div className="bg-white border rounded-lg shadow-sm p-6 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white border rounded-lg shadow-sm p-6 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }
  
  if (!memberVotes || memberVotes.length === 0) {
    return (
      <div className="bg-white border rounded-lg shadow-sm p-6 text-center">
        <p className="text-gray-600">No voting history available for this member.</p>
      </div>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(memberVotes.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = memberVotes.slice(indexOfFirstItem, indexOfLastItem);

  // Handle pagination
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Voting History</h2>
      </div>
      
      <div className="divide-y">
        {currentItems.map((vote, index) => (
          <div key={vote.id || index} className="p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">{vote.bill || 'Motion'}</h3>
                <p className="text-sm text-gray-600">{vote.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  vote.vote === 'Yea' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {vote.vote}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${
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
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t p-4">
          <button 
            className="px-3 py-1 border rounded text-sm hover:bg-gray-50 disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={handlePreviousPage}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
          <button 
            className="px-3 py-1 border rounded text-sm hover:bg-gray-50 disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default VotingHistory;