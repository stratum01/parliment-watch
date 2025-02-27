import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const VoteCard = ({ vote }) => {
  if (!vote) return null;

  const { number, date, description, result, yea_total, nay_total, paired_total, bill_url } = vote;
  
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
  const yeaPercent = Math.round((yea_total / totalVotes) * 100);
  const nayPercent = Math.round((nay_total / totalVotes) * 100);

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden mb-4">
      <div className="p-3 border-b">
        <div className="flex justify-between items-center">
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
          <div className="text-sm text-gray-500">{formattedDate}</div>
        </div>
        <p className="text-base text-gray-700 mt-1">{description?.en || description}</p>
        {bill_url && (
          <a 
            href={`#${bill_url}`}
            className="mt-1 text-sm text-blue-600 hover:text-blue-800 inline-flex items-center"
          >
            View Related Bill
          </a>
        )}
      </div>
      
      <div className="p-3 bg-gray-50 flex items-center">
        <div className="w-1/3 pr-2">
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={40}
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
        </div>
        
        <div className="w-2/3 grid grid-cols-3 gap-2">
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">{yea_total}</div>
            <div className="text-sm font-medium text-gray-600">Yea</div>
            <div className="text-xs text-gray-500">({yeaPercent}%)</div>
          </div>
          
          <div className="text-center">
            <div className="text-xl font-bold text-red-600">{nay_total}</div>
            <div className="text-sm font-medium text-gray-600">Nay</div>
            <div className="text-xs text-gray-500">({nayPercent}%)</div>
          </div>
          
          <div className="text-center">
            <div className="text-xl font-bold text-gray-700">{totalVotes}</div>
            <div className="text-sm font-medium text-gray-600">Total</div>
            <div className="text-xs text-gray-500">&nbsp;</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoteCard;