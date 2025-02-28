import React from 'react';
import { useParams, Link } from 'react-router-dom';

const BillDetails = () => {
  const { billId } = useParams();

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

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900">
            Bill {billId}
          </h1>
        </div>
        
        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-md mb-6">
            <h3 className="text-lg font-medium mb-2">API Access Limitation</h3>
            <p className="mb-2">
              Due to Cross-Origin Resource Sharing (CORS) restrictions, we're unable to directly fetch detailed information about this bill from the OpenParliament API.
            </p>
            <p>
              You can view the full details of this bill on the official OpenParliament website:
            </p>
          </div>
          
          <div className="mt-4">
            <a 
              href={`https://openparliament.ca/bills/44-1/${billId}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Bill {billId} on OpenParliament.ca
            </a>
          </div>
          
          <div className="mt-8">
            <h3 className="text-md font-semibold text-gray-700 mb-4">About CORS Issues</h3>
            <p className="text-gray-600">
              CORS is a security feature implemented by web browsers that restricts web pages from making requests to a different domain than the one that served the web page.
            </p>
            <p className="text-gray-600 mt-2">
              To properly resolve this, we would need to implement a server-side proxy that fetches data from the OpenParliament API on behalf of this web application. This is on our roadmap for future development.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillDetails;