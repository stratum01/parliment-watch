import React from 'react';

const VoteCard = ({ vote }) => {
  if (!vote) return null;

  const { number, date, description, result, yea_total, nay_total, paired_total, bill_url } = vote;
  
  const formattedDate = new Date(date).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  const totalVotes = (yea_total || 0) + (nay_total || 0) + (paired_total || 0);
  const yeaPercent = totalVotes ? Math.round(((yea_total || 0) / totalVotes) * 100) : 0;
  const nayPercent = totalVotes ? Math.round(((nay_total || 0) / totalVotes) * 100) : 0;

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold flex items-center">
            Vote #{number}
            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
              result === 'Passed' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {result}
            </span>
          </h3>
          <div className="text-sm text-gray-500">
            {formattedDate}
          </div>
        </div>
        <p className="text-gray-700">{description?.en || description}</p>
        {bill_url && (
          <a 
            href={`#${bill_url}`}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 inline-flex items-center"
          >
            View Related Bill
          </a>
        )}
      </div>
      
      <div className="p-4 bg-gray-50 md:flex">
        <div className="w-full md:w-1/2 flex justify-center mb-4 md:mb-0">
          <div className="relative h-32 w-32">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="15"
              />
              {/* Yea votes */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#10b981"
                strokeWidth="15"
                strokeDasharray={`${yeaPercent * 2.51} 251`}
                strokeDashoffset="0"
                transform="rotate(-90 50 50)"
              />
              {/* Nay votes */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#ef4444"
                strokeWidth="15"
                strokeDasharray={`${nayPercent * 2.51} 251`}
                strokeDashoffset={`${-yeaPercent * 2.51}`}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold">{totalVotes}</span>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium">Yea</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold">{yea_total || 0}</span>
                <span className="text-sm text-gray-500">({yeaPercent}%)</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium">Nay</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold">{nay_total || 0}</span>
                <span className="text-sm text-gray-500">({nayPercent}%)</span>
              </div>
            </div>
            
            {(paired_total > 0) && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                  <span className="text-sm font-medium">Paired</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold">{paired_total}</span>
                  <span className="text-sm text-gray-500">
                    ({Math.round((paired_total / totalVotes) * 100)}%)
                  </span>
                </div>
              </div>
            )}
            
            <div className="pt-2 mt-2 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Votes</span>
                <span className="text-sm font-bold">{totalVotes}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-3 border-t bg-gray-50 text-xs text-gray-500 flex items-center">
        <span>Voting data provided by OpenParliament.ca</span>
      </div>
    </div>
  );
};

export default VoteCard;