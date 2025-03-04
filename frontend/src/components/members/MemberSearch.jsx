import React, { useState } from 'react';
import useMembers from '../../hooks/useMembers';
import SearchControls from '../shared/SearchControls';

const MemberSearch = ({ onMemberSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { 
    members, 
    loading, 
    error,
    fetchMemberDetails,
    detailsLoading,
    pagination,
    goToNextPage,
    goToPreviousPage
  } = useMembers();

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

  // Filter members based on search term
  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.constituency && member.constituency.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="mb-6">
      <SearchControls
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search MPs by name or constituency..."
      />
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mt-4">
          <p>Error: {error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {filteredMembers.length === 0 ? (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">No members found matching your search criteria.</p>
              </div>
            ) : (
              filteredMembers.map(member => (
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
                      <p className="text-xs text-gray-500">{member.party}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && searchTerm === '' && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={goToPreviousPage}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 disabled:opacity-50"
              >
                Previous
              </button>
              
              <div className="text-sm text-gray-700">
                <span>Page {pagination.page} of {pagination.totalPages}</span>
                <span className="mx-2">•</span>
                <span>Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.totalMembers)} of {pagination.totalMembers} members</span>
              </div>
              
              <button
                onClick={goToNextPage}
                disabled={pagination.page >= pagination.totalPages}
                className="px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
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