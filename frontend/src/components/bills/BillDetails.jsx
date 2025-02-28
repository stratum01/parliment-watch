import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBillDetails } from '../../lib/api/openParliament';

const BillDetails = () => {
  const { billId } = useParams();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBillDetails = async () => {
      try {
        setLoading(true);
        
        // Convert bill ID to URL format (e.g., "C-79" to "/bills/44-1/C-79/")
        // This is a simplification - ideally we'd store the full URL in the bill card
        const billUrl = `/bills/44-1/${billId}/`;
        
        const data = await getBillDetails(billUrl);
        console.log('Bill details:', data);
        setBill(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching bill details:', err);
        setError('Failed to load bill details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (billId) {
      fetchBillDetails();
    }
  }, [billId]);

  // Format the date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Royal Assent':
        return 'bg-emerald-100 text-emerald-800';
      case 'Third Reading':
        return 'bg-blue-100 text-blue-800';
      case 'Committee':
        return 'bg-purple-100 text-purple-800';
      case 'Second Reading':
        return 'bg-amber-100 text-amber-800';
      case 'First Reading':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="mb-6">
        <Link 
          to="/bills"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Bills
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
      ) : !bill ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-md">
          <p>No bill found with ID {billId}. This could be due to:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>The bill doesn't exist</li>
            <li>The bill is from a different parliamentary session</li>
            <li>There's an issue with the API connection</li>
          </ul>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Bill {bill.number}
                  {bill.law && (
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-800">
                      Enacted
                    </span>
                  )}
                </h1>
                <h2 className="text-lg text-gray-700 mt-1">
                  {bill.name?.en || bill.name || 'Untitled Bill'}
                </h2>
              </div>
              <div className="mt-4 md:mt-0 text-sm text-gray-500">
                Introduced: {formatDate(bill.introduced)}
              </div>
            </div>
          </div>
          
          {/* Bill Details */}
          <div className="p-6">
            {/* Sponsor */}
            {bill.sponsor_politician && (
              <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-700 mb-2">Sponsor</h3>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
                  <div className="ml-4">
                    <p className="font-medium">{bill.sponsor_politician}</p>
                    {bill.sponsor_politician_party && (
                      <p className="text-sm text-gray-500">{bill.sponsor_politician_party}</p>
                    )}
                    {bill.sponsor_politician_riding && (
                      <p className="text-sm text-gray-500">{bill.sponsor_politician_riding}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Sessions */}
            <div className="mb-6">
              <h3 className="text-md font-semibold text-gray-700 mb-2">Parliamentary Session</h3>
              <p className="text-gray-700">{bill.session}</p>
            </div>
            
            {/* Summary */}
            {bill.summary_html && (
              <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-700 mb-2">Summary</h3>
                <div 
                  className="prose prose-blue max-w-none"
                  dangerouslySetInnerHTML={{ __html: bill.summary_html }}
                />
              </div>
            )}
            
            {/* Additional details that might be available */}
            {bill.text_url && (
              <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-700 mb-2">Bill Text</h3>
                <a 
                  href={bill.text_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Full Text of Bill
                </a>
              </div>
            )}
          </div>
          
          {/* Footer with external links */}
          <div className="bg-gray-50 p-4 border-t">
            <div className="flex justify-between items-center text-sm">
              <div>
                <span className="text-gray-600">Session:</span> {bill.session}
              </div>
              <a 
                href={`https://openparliament.ca${bill.url}`}
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

export default BillDetails;