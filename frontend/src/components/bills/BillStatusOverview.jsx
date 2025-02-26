import React from 'react';
import { Card } from '@/components/ui/card';

const BillStatusOverview = ({ stats }) => {
  const statusItems = [
    {
      status: "First Reading",
      count: stats?.firstReading || 12,
      color: "text-blue-600",
      description: "Bills introduced"
    },
    {
      status: "Second Reading",
      count: stats?.secondReading || 8,
      color: "text-purple-600",
      description: "Under debate"
    },
    {
      status: "Committee",
      count: stats?.committee || 5,
      color: "text-orange-600",
      description: "In committee"
    },
    {
      status: "Third Reading",
      count: stats?.thirdReading || 3,
      color: "text-green-600",
      description: "Final stage"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statusItems.map((item) => (
        <Card key={item.status} className="flex items-center p-4">
          <div className="mr-4">
            <div className={`text-4xl font-bold ${item.color}`}>{item.count}</div>
          </div>
          <div>
            <h3 className="font-medium">{item.status}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};