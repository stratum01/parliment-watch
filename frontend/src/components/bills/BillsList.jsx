import React, { useState } from 'react';
import BillCard from './BillCard';

const BillsList = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Mock data directly included
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

  // Filter bills based on status and search query
  const filteredBills = mockBills.filter(bill => {
    const matchesStatus = !statusFilter || bill.status === statusFilter;
    const matchesSearch = !searchQuery || 
      bill.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.number.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Get unique statuses for the filter dropdown
  const statuses = [...new Set(mockBills.map(bill => bill.status))];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <label htmlFor="bills-search" className="sr-only">Search Bills</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input 
                id="bills-search"
                type="search"
                className="block w-full pl-10 pr-3 py-2 border rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search by bill name or number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <label htmlFor="status-filter" className="text-sm font-medium text-gray-700 mr-2">
                Status:
              </label>
            </div>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          
          {(statusFilter || searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter('');
                setSearchQuery('');
              }}
              className="md:w-auto w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Bills List */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredBills.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg border">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No bills found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try changing your search query or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBills.map(bill => (
            <BillCard key={bill.id || bill.number} bill={bill} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BillsList;