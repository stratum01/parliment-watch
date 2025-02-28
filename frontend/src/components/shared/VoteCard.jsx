import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const VoteCard = ({ vote }) => {
  if (!vote) return null;

  // Handle data from either mock data or the OpenParliament API
  const number = vote.number;
  const date = vote.date;
  const description = typeof vote.description === 'object' 
    ? vote.description.en 
    : (vote.description || 'No description available');
  const result = vote.result;
  const yea_total = vote.yea_total || 0;
  const nay_total = vote.nay_total || 0;
  const paired_total = vote.paired_total || 0;
  const bill_url = vote.bill_url;
  
  // Prepare data for the pie chart
  const data = [
    { name: 'Yea', value: yea_total, color: '#10b981' }, // Green
    { name: 'Nay', value: nay_total, color: '#ef4444' },  // Red
  ];
  
  // Add paired votes if they exist
  if (paired_total > 0) {
    data.push({ name: 'Paired', value: paired_total, color: '#94a3b8' }); // Gray
  }
  
  // Format the date
  const formattedDate = new Date(date).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Total votes
  const totalVotes = yea_total + nay_total + (paired_total || 0);
  
  // Calculate percentages
  const yeaPercent = totalVotes > 0 ? Math.round((yea_total / totalVotes) * 100) : 0;
  const nayPercent = totalVotes > 0 ? Math.round((nay_total / totalVotes) * 100) : 0;

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
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            {formattedDate}
          </div>
        </div>
        <p className="text-gray-700">{description.en}</p>
        {bill_url && (
          <a 
            href={`#${bill_url}`}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 inline-flex items-center"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            View Related Bill
          </a>
        )}
      </div>
      
      <div className="p-4 bg-gray-50 md:flex">
        <div className="w-full md:w-1/2 flex justify-center mb-4 md:mb-0">
          <ResponsiveContainer width={180} height={180}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} votes`, '']}
                contentStyle={{ borderRadius: '6px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium">Yea</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold">{yea_total}</span>
                <span className="text-sm text-gray-500">({yeaPercent}%)</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium">Nay</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold">{nay_total}</span>
                <span className="text-sm text-gray-500">({nayPercent}%)</span>
              </div>
            </div>
            
            {paired_total > 0 && (
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
        <Info className="h-3 w-3 mr-1" />
        <span>Voting data provided by OpenParliament.ca</span>
      </div>
    </div>
  );
};

export default VoteCard;