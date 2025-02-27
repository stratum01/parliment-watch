import React from 'react';
import { Calendar, User, ExternalLink, FileText } from 'lucide-react';

const BillCard = ({ bill }) => {
  if (!bill) return null;
  
  const { number, name, introduced_date, status, sponsor, last_event, progress } = bill;
  
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
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">
            Bill {number}
            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getStatusColor()}`}>
              {status}
            </span>
          </h3>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            {formattedDate}
          </div>
        </div>
        <p className="text-gray-700">{name.en}</p>
      </div>
      
      <div className="p-4">
        <div className="flex items-center text-sm mb-4">
          <User className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-gray-700 font-medium">Sponsor:</span>
          <span className="ml-2">{sponsor}</span>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="text-sm">
          <div className="font-medium mb-1">Last Event:</div>
          <div className="text-gray-700">{last_event}</div>
        </div>
      </div>
      
      <div className="px-4 py-3 bg-gray-50 border-t">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Session: {bill.session}
          </span>
          <a 
            href={`#/bills/${number}`}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <span className="mr-1">View Details</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default BillCard;