import React, { useState } from 'react';

const VotingHistory = ({ votes }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  if (!votes || votes.length === 0) {
    return (
      <div className="bg-white border rounded-lg shadow-sm p-6 text-center">
        <p className="text-gray-600">No voting history available for this member.</p>
      </div>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(votes.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = votes.slice(indexOfFirstItem, indexOfLastItem);

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
          <div key={index} className="p-4 hover:bg-gray-50">
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