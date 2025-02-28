import React from 'react';
import { useParams, Link } from 'react-router-dom';

const VoteDetails = () => {
  const { voteId } = useParams();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Votes
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900">
            Vote #{voteId}
          </h1>
          <p className="mt-2 text-gray-600">
            Loading vote details...
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoteDetails;