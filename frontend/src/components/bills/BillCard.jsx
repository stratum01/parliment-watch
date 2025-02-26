import React from 'react';

const BillCard = ({ bill }) => {
  return (
    <div className="p-4 hover:bg-gray-50">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium">Bill {bill.number}</h3>
          <p className="text-sm text-gray-600">{bill.name}</p>
        </div>
        <span className="px-2 py-1 text-sm rounded bg-gray-100">{bill.status}</span>
      </div>
      <div className="space-y-2">
        <div className="text-sm">
          <span className="text-gray-600">Introduced:</span> {bill.introduced}
        </div>
        <div className="text-sm">
          <span className="text-gray-600">Sponsor:</span> {bill.sponsor}
        </div>
        <div className="text-sm">
          <span className="text-gray-600">Last Event:</span> {bill.lastEvent}
        </div>
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div className="text-xs text-gray-600">Progress</div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100">
            <div
              style={{ width: `${bill.progress}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};