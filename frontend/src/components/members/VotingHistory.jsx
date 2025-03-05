import React, { useState, useEffect } from 'react';

const VotingHistory = ({ votes: initialVotes, memberId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [memberVotes, setMemberVotes] = useState([]);
  const itemsPerPage = 5;
  
  // Fetch votes if they're not provided directly
  useEffect(() => {
    const fetchVotes = async () => {
      if (initialVotes && initialVotes.length > 0) {
        setMemberVotes(initialVotes);
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
        
        try {
          // Try to fetch ballots directly from OpenParliament API
          const openParliamentUrl = `https://api.openparliament.ca/votes/ballots/?politician=${memberName}&format=json&limit=50`;
          console.log('Fetching from:', openParliamentUrl);
          
          const ballotsResponse = await fetch(openParliamentUrl);
          
          if (!ballotsResponse.ok) {
            throw new Error(`OpenParliament API error: ${ballotsResponse.status}`);
          }
          
          const ballotsData = await ballotsResponse.json();
          console.log('Raw ballots data:', ballotsData);
          
          // Extract votes from the API response
          const ballotsArray = ballotsData.objects || [];
          
          if (ballotsArray.length === 0) {
            setMemberVotes([]);
            setLoading(false);
            return;
          }
          
          // Now we need to fetch details for each vote
          const enrichedVotes = await Promise.all(
            ballotsArray.slice(0, 20).map(async (ballot) => {
              try {
                // Extract vote ID from vote_url
                const voteId = ballot.vote_url.split('/').filter(Boolean).pop();
                const voteSessionPart = ballot.vote_url.split('/').filter(Boolean).slice(-3);
                const voteSession = voteSessionPart[0]; // e.g., "44-1"
                const voteNumber = voteSessionPart[2]; // e.g., "928"
                
                // Fetch vote details
                const voteUrl = `https://api.openparliament.ca/votes/${voteSession}/${voteNumber}/?format=json`;
                const voteResponse = await fetch(voteUrl);
                
                if (!voteResponse.ok) {
                  console.warn(`Could not fetch details for vote ${voteId}`);
                  return {
                    id: voteId,
                    bill: 'Unknown',
                    description: 'Vote details unavailable',
                    date: 'Unknown date',
                    vote: ballot.ballot,
                    result: 'Unknown'
                  };
                }
                
                const voteData = await voteResponse.json();
                
                // Check if this vote is related to a bill
                let billInfo = 'Motion';
                if (voteData.bill) {
                  billInfo = `Bill ${voteData.bill.number}`;
                }
                
                return {
                  id: voteId,
                  bill: billInfo,
                  description: voteData.description?.en || voteData.description || 'No description available',
                  date: voteData.date || 'Unknown date',
                  vote: ballot.ballot === 'Yes' ? 'Yea' : ballot.ballot === 'No' ? 'Nay' : ballot.ballot,
                  result: voteData.result || (voteData.passed ? 'Passed' : 'Failed')
                };
              } catch (error) {
                console.error('Error fetching vote details:', error);
                return {
                  id: ballot.vote_url,
                  bill: 'Unknown',
                  description: 'Vote details unavailable',
                  date: 'Unknown date',
                  vote: ballot.ballot,
                  result: 'Unknown'
                };
              }
            })
          );
          
          console.log('Enriched votes data:', enrichedVotes);
          setMemberVotes(enrichedVotes.filter(vote => vote !== null));
        } catch (apiErr) {
          console.error('Error fetching votes from OpenParliament API:', apiErr);
          
          // Fall back to our API if OpenParliament direct access fails
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
            console.log('Raw votes data from our API:', data);
            
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
          } catch (fallbackErr) {
            console.error('Error fetching votes from our API:', fallbackErr);
            setMemberVotes([]);
          }
        }
      } catch (err) {
        console.error('Error in votes process:', err);
        setError('Could not retrieve voting history at this time.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVotes();
  }, [initialVotes, memberId]);
  
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
                  vote.vote === 'Yea' || vote.vote === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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