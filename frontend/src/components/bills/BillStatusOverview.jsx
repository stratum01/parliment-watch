import React from 'react';
import { useBills } from '@/hooks/useBills';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BillStatusOverview = () => {
  const { bills, loading, error } = useBills();

  // Count bills by status
  const getStatusCounts = () => {
    const statusMap = {};
    
    bills.forEach(bill => {
      if (!statusMap[bill.status]) {
        statusMap[bill.status] = 0;
      }
      statusMap[bill.status]++;
    });
    
    // Convert to array format for Recharts
    return Object.entries(statusMap).map(([status, count]) => ({
      status,
      count
    }));
  };

  // Color mapping for statuses
  const getStatusColor = (status) => {
    switch (status) {
      case 'Royal Assent': return '#10b981'; // green
      case 'Third Reading': return '#3b82f6'; // blue
      case 'Committee': return '#8b5cf6'; // purple
      case 'Second Reading': return '#f59e0b'; // amber
      case 'First Reading': return '#f97316'; // orange
      default: return '#6b7280'; // gray
    }
  };

  // Get the data for the chart
  const statusData = getStatusCounts();

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Bill Status Overview</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : (
        <div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={statusData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [`${value} bills`, 'Count']}
                  labelFormatter={(label) => `Status: ${label}`}
                />
                <Bar 
                  dataKey="count" 
                  name="Bills" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  // Use different colors for each status
                  fill={(entry) => getStatusColor(entry.status)}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-2">
            {statusData.map(item => (
              <div key={item.status} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: getStatusColor(item.status) }}
                ></div>
                <span className="text-sm font-medium">{item.status}:</span>
                <span className="text-sm ml-1">{item.count} bills</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BillStatusOverview;