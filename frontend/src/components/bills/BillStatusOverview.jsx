import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const BillStatusOverview = () => {
  // Mock bills data directly included
  const mockBills = [
    {
      id: "b1",
      number: "C-79",
      name: {
        en: "An Act for granting to His Majesty certain sums of money for the federal public administration",
        fr: "Loi portant octroi à Sa Majesté de crédits pour l'administration publique fédérale"
      },
      introduced_date: "2024-12-01",
      status: "Third Reading",
      sponsor: "Hon. Chrystia Freeland",
      last_event: "Passed third reading (2024-12-10)",
      progress: 90,
      session: "44-1"
    },
    {
      id: "b2",
      number: "C-45",
      name: {
        en: "Cannabis Regulation Amendment Act",
        fr: "Loi modifiant la réglementation du cannabis"
      },
      introduced_date: "2024-11-15",
      status: "Committee",
      sponsor: "Hon. Mark Holland",
      last_event: "Referred to committee (2024-12-01)",
      progress: 60,
      session: "44-1"
    },
    {
      id: "b3",
      number: "C-56",
      name: {
        en: "Affordable Housing and Public Transit Act",
        fr: "Loi sur le logement abordable et le transport en commun"
      },
      introduced_date: "2024-11-01",
      status: "Second Reading",
      sponsor: "Hon. Sean Fraser",
      last_event: "Debate at second reading (2024-11-20)",
      progress: 40,
      session: "44-1"
    },
    {
      id: "b4",
      number: "C-123",
      name: {
        en: "Economic Statement Implementation Act",
        fr: "Loi d'exécution de l'énoncé économique"
      },
      introduced_date: "2024-10-20",
      status: "Royal Assent",
      sponsor: "Hon. Chrystia Freeland",
      last_event: "Royal Assent received (2024-12-15)",
      progress: 100,
      session: "44-1"
    },
    {
      id: "b5",
      number: "C-32",
      name: {
        en: "Online Streaming Act",
        fr: "Loi sur la diffusion continue en ligne"
      },
      introduced_date: "2024-10-15",
      status: "First Reading",
      sponsor: "Hon. Pablo Rodriguez",
      last_event: "Introduction and first reading (2024-10-15)",
      progress: 20,
      session: "44-1"
    },
    {
      id: "b6",
      number: "C-18",
      name: {
        en: "Online News Act",
        fr: "Loi sur les nouvelles en ligne"
      },
      introduced_date: "2024-09-22",
      status: "Royal Assent",
      sponsor: "Hon. Pablo Rodriguez",
      last_event: "Royal Assent received (2024-11-07)",
      progress: 100,
      session: "44-1"
    }
  ];

  // Count bills by status
  const getStatusCounts = () => {
    const statusMap = {};
    
    mockBills.forEach(bill => {
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
    <div className="bg-white p-4 rounded-lg border mb-6">
      <h2 className="text-lg font-semibold mb-4">Bill Status Overview</h2>
      
      <div>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={statusData}
              margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="status" 
                angle={-45} 
                textAnchor="end"
                tick={{ fontSize: 12 }}
                height={60}
              />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [`${value} bills`, 'Count']}
                labelFormatter={(label) => `Status: ${label}`}
              />
              <Bar 
                dataKey="count" 
                name="Bills" 
                isAnimationActive={false}
                fill="#3b82f6"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
                ))}
              </Bar>            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
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
    </div>
  );
};

export default BillStatusOverview;