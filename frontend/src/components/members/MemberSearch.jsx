import React, { useState, useEffect } from 'react';
import useMembers from '../../hooks/useMembers';
import SearchControls from '../shared/SearchControls';

const MemberSearch = ({ onMemberSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [displayCount, setDisplayCount] = useState(12); // Show 12 members initially
  const [selectedParty, setSelectedParty] = useState(''); // For party filtering
  
  const { 
    members, 
    allMembers,
    loading, 
    error,
    fetchMemberDetails,
    detailsLoading,
    pagination,
    refresh,
    loadMore 
  } = useMembers();

  // Debug log to check when members change
  useEffect(() => {
    console.log(`Members updated, count: ${members.length}`);
  }, [members]);

  // Handler for party filter button clicks
  const handlePartyFilter = (party) => {
    console.log('Party filter clicked:', party);
    
    // Update local state
    setSelectedParty(party);
    setDisplayCount(12); // Reset display count when changing filters
    
    // Call refresh with the party filter
    console.log('Calling refresh with party filter:', { party });
    refresh({ party });
  };

  // Enhanced handler for when a member is selected
  const handleMemberSelect = async (member) => {
    try {
      // Get the member ID (URL) from the member object
      const memberId = member.id;
      
      // Log for debugging
      console.log('Fetching details for member:', member.name, 'ID:', memberId);
      
      // Fetch detailed info before passing to parent component
      const detailedMember = await fetchMemberDetails(memberId);
      
      // If we got detailed member, use it, otherwise use the list member
      onMemberSelect(detailedMember || member);
    } catch (err) {
      console.error('Error fetching member details:', err);
      // Fall back to basic member info if detailed fetch fails
      onMemberSelect(member);
    }
  };

  // Get unique parties for filtering from all fetched members
  const parties = [...new Set(allMembers.map(member => member.party))].filter(Boolean).sort();
  
  // Filter members based on search term
  const filteredBySearch = searchTerm 
    ? members.filter(member => {
        return member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               (member.constituency && member.constituency.toLowerCase().includes(searchTerm.toLowerCase()));
      })
    : members;

  // Handler for Load More button
  const handleLoadMore = () => {
    console.log('Load More clicked');
    
    // If we have more already loaded members to show
    if (displayCount < filteredBySearch.length) {
      console.log(`Increasing display count from ${displayCount} to ${displayCount + 12}`);
      setDisplayCount(prev => prev + 12);
    } 
    // Otherwise fetch more data from the API
    else if (pagination.nextOffset) {
      console.log('Need to load more data from API');
      loadMore();
    } else {
      console.log('No more data to load');
    }
  };

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 mb-4">
        <SearchControls
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Search MPs by name or constituency..."
          className="flex-grow"
        />
        
        {/* Party Filter Buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => handlePartyFilter('')}
            className={`px-3 py-1 text-sm rounded-full ${
              selectedParty === '' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Parties
          </button>
  
          {parties.map(party => (
            <button
              key={party}
              onClick={() => handlePartyFilter(party)}
              className={`px-3 py-1 text-sm rounded-full ${
                selectedParty === party
                  ? party === 'Conservative' ? 'bg-blue-600 text-white' :
                    party === 'Liberal' ? 'bg-red-600 text-white' :
                    party === 'NDP' ? 'bg-orange-600 text-white' :
                    party === 'Green' ? 'bg-green-600 text-white' :
                    party === 'Bloc Québécois' ? 'bg-sky-600 text-white' :
                    'bg-gray-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {party}
            </button>
          ))}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mt-4">
          <p>Error: {error}</p>
        </div>
      )}
      
      {loading && filteredBySearch.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {filteredBySearch.length === 0 ? (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">No members found matching your search criteria.</p>
              </div>
            ) : (
              filteredBySearch.slice(0, displayCount).map(member => (
                <div
                  key={member.id}
                  className="p-4 border rounded-lg hover:border-blue-200 cursor-pointer"
                  onClick={() => handleMemberSelect(member)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img
                        src={member.photo_url || "/api/placeholder/100/100"}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.constituency}</p>
                      <p className={`text-xs font-semibold ${
                        member.party === 'Conservative' ? 'text-blue-600' :
                        member.party === 'Liberal' ? 'text-red-600' :
                        member.party === 'NDP' ? 'text-orange-600' :
                        member.party === 'Green' ? 'text-green-600' :
                        member.party === 'Bloc Québécois' ? 'text-sky-600' :
                        'text-gray-600'
                      }`}>
                        {member.party}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Load More Button */}
          {(filteredBySearch.length > displayCount || pagination.nextOffset) && (
            <div className="text-center mt-6">
              <button 
                onClick={handleLoadMore}
                disabled={loading && filteredBySearch.length > 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  'Load More Members'
                )}
              </button>
            </div>
          )}
          
          {/* Stats about displayed members */}
          <div className="text-center mt-2 text-sm text-gray-500">
            Showing {Math.min(displayCount, filteredBySearch.length)} of {filteredBySearch.length} members
            {pagination.nextOffset ? ' (more available from API)' : ''}
          </div>
        </>
      )}
      
      {detailsLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
              <p>Loading member details...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberSearch;