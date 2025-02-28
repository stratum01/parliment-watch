import React from 'react';
import { Link } from 'react-router-dom';

const BillCard = ({ bill }) => {
  if (!bill) return null;
  
  // Handle data from either mock data or the OpenParliament API
  const number = bill.number;
  const name = typeof bill.name === 'object' ? bill.name.en : (bill.name || 'Untitled');
  const introduced_date = bill.introduced_date || bill.introduced || new Date().toISOString().split('T')[0];
  const status = bill.status || 'First Reading'; // Default status
  const sponsor = bill.sponsor || 'Unknown';
  const last_event = bill.last_event || `Introduced (${introduced_date})`;
  const progress = bill.progress || 20; // Default progress
  const session = bill.session;
  
  // Format the date
  const formattedDate = new Date(introduced_date).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  // Determine status color
  const getStatusColor = () => {
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
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden mb-4">
      <div className="p-3 border-b">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            Bill {number}
            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getStatusColor()}`}>
              {status}
            </span>
          </h3>
          <div className="text-sm text-gray-500">{formattedDate}</div>
        </div>
        <p className="text-base text-gray-700 mt-1">{name}</p>
      </div>
      
      <div className="p-3">
        <div className="flex items-center text-sm mb-3">
          <svg className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-gray-700 font-medium">Sponsor:</span>
          <span className="ml-2">{sponsor}</span>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="text-sm">
          <div className="font-medium mb-1">Last Event:</div>
          <div className="text-gray-700">{last_event}</div>
        </div>
      </div>
      
      <div className="px-3 py-2 bg-gray-50 border-t">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Session: {session}
          </span>
          <Link 
            to={`/bills/${number}`}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <span className="mr-1">View Details</span>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BillCard;