import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVoteDetails } from '../../lib/api/openParliament';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const VoteDetails = () => {
  const { voteId } = useParams();
  const [vote, setVote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVoteDetails = async () => {
      try {
        setLoading(true);
        
        // Convert vote ID to URL format (e.g., "928" to "/votes/44-1/928/")
        const voteUrl = `/votes/44-1/${voteId}/`;
        
        const data = await getVoteDetails(voteUrl);
        console.log('Vote details:', data);
        setVote(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching vote details:', err);
        setError('Failed to load vote details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (voteId) {
      fetchVoteDetails();
    }
  }, [voteId]);

  // Format the date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Extract bill number from URL if available
  const extractBillNumber = (url) => {
    if (!url) return null;
    const parts = url.split('/');
    return parts[parts.length - 2];
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
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

      {loading ? (
        <div className="flex justify-center items-center py-12 bg-white shadow-md rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <p>{error}</p>
        </div>
      ) : !vote ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-md">
          <p>No vote found with ID {voteId}. This could be due to:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>The vote doesn't exist</li>
            <li>The vote is from a different parliamentary session</li>
            <li>There's an issue with the API connection</li>
          </ul>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  Vote #{vote.number}
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    vote.result === 'Passed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {vote.result}
                  </span>
                </h1>
                <h2 className="text-lg text-gray-700 mt-1">
                  {vote.description?.en || vote.description || 'No description available'}
                </h2>
              </div>
              <div className="mt-4 md:mt-0 text-sm text-gray-500">
                {formatDate(vote.date)}
              </div>
            </div>
          </div>
          
          {/* Vote Details */}
          <div className="p-6">
            {/* Vote Breakdown */}
            <div className="mb-8">
              <h3 className="text-md font-semibold text-gray-700 mb-4">Vote Breakdown</h3>
              
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 mb-4 md:mb-0">
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Yea', value: vote.yea_total || 0, color: '#10b981' },
                            { name: 'Nay', value: vote.nay_total || 0, color: '#ef4444' },
                            ...(vote.paired_total ? [{ name: 'Paired', value: vote.paired_total, color: '#94a3b8' }] : [])
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {[
                            { name: 'Yea', value: vote.yea_total || 0, color: '#10b981' },
                            { name: 'Nay', value: vote.nay_total || 0, color: '#ef4444' },
                            ...(vote.paired_total ? [{ name: 'Paired', value: vote.paired_total, color: '#94a3b8' }] : [])
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value} votes`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="w-full md:w-1/2 p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{vote.yea_total || 0}</div>
                      <div className="text-sm font-medium text-gray-600">Yea Votes</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {vote.yea_total && vote.nay_total ? 
                          `(${Math.round((vote.yea_total / (vote.yea_total + vote.nay_total + (vote.paired_total || 0))) * 100)}%)` 
                          : '(0%)'}
                      </div>
                    </div>
                    
                    <div className="bg-red-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{vote.nay_total || 0}</div>
                      <div className="text-sm font-medium text-gray-600">Nay Votes</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {vote.yea_total && vote.nay_total ? 
                          `(${Math.round((vote.nay_total / (vote.yea_total + vote.nay_total + (vote.paired_total || 0))) * 100)}%)` 
                          : '(0%)'}
                      </div>
                    </div>
                    
                    {vote.paired_total > 0 && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-gray-600">{vote.paired_total}</div>
                        <div className="text-sm font-medium text-gray-600">Paired Votes</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {`(${Math.round((vote.paired_total / (vote.yea_total + vote.nay_total + vote.paired_total)) * 100)}%)`}
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {(vote.yea_total || 0) + (vote.nay_total || 0) + (vote.paired_total || 0)}
                      </div>
                      <div className="text-sm font-medium text-gray-600">Total Votes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional Info */}
            {vote.bill_url && (
              <div>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Related Bill</h3>
                <Link
                  to={`/bills/${extractBillNumber(vote.bill_url)}`}
                  className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                >
                  <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Bill {extractBillNumber(vote.bill_url)}
                </Link>
              </div>
            )}
          </div>
          
          {/* Footer with additional information */}
          <div className="bg-gray-50 p-4 border-t">
            <div className="flex justify-between items-center text-sm">
              <div>
                <span className="text-gray-600">Session:</span> {vote.session}
              </div>
              <a 
                href={`https://openparliament.ca${vote.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                View on OpenParliament.ca
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoteDetails;