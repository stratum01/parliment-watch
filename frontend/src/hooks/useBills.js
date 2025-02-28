// src/hooks/useBills.js

import { useState, useEffect, useCallback } from 'react';
import { getBills, getBillDetails } from '../lib/api/openParliament';
import { parsePagination } from '../lib/paginationUtils';
import { handleAPIError } from '../lib/api/errorHandler';

/**
 * Hook to fetch and manage bills data from the OpenParliament API
 * @param {Object} options - Hook options
 * @param {number} options.limit - Number of bills per page
 * @param {number} options.initialOffset - Initial offset for pagination
 * @param {string} options.session - Parliamentary session to filter by
 * @returns {Object} - Bills data and control functions
 */
function useBills({ limit = 20, initialOffset = 0, session = null } = {}) {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    offset: initialOffset,
    limit,
    hasNext: false,
    hasPrevious: false,
    nextUrl: null,
    previousUrl: null,
    totalPages: 0,
    currentPage: 0,
  });

  // Fetch bills with current pagination and filters
  const fetchBills = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getBills({
        limit: pagination.limit,
        offset: pagination.offset,
        session,
      });
      
      // Update bills data
      setBills(data.objects || []);
      
      // Update pagination information
      const paginationData = data.pagination || {};
      setPagination(prev => ({
        ...prev,
        ...parsePagination(paginationData, prev.limit)
      }));
    } catch (err) {
      setError(handleAPIError(err, 'Failed to load bills data. Please try again.'));
      console.error('Error fetching bills:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit, pagination.offset, session]);

  // Initial data fetch
  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  // Handle manual refresh
  const refresh = () => {
    fetchBills();
  };

  // Handle pagination
  const goToNextPage = useCallback(() => {
    if (pagination.hasNext) {
      setPagination(prev => ({
        ...prev,
        offset: prev.offset + prev.limit,
      }));
    }
  }, [pagination.hasNext]);

  const goToPreviousPage = useCallback(() => {
    if (pagination.hasPrevious) {
      setPagination(prev => ({
        ...prev,
        offset: Math.max(0, prev.offset - prev.limit),
      }));
    }
  }, [pagination.hasPrevious]);

  const goToPage = useCallback((page) => {
    const newOffset = Math.max(0, (page - 1) * pagination.limit);
    setPagination(prev => ({
      ...prev,
      offset: newOffset,
    }));
  }, [pagination.limit]);

  // Fetch a single bill's details
  const [billDetails, setBillDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  const fetchBillDetails = useCallback(async (billUrl) => {
    if (!billUrl) return;
    
    try {
      setDetailsLoading(true);
      setDetailsError(null);
      
      const data = await getBillDetails(billUrl);
      setBillDetails(data);
    } catch (err) {
      setDetailsError(handleAPIError(err, 'Failed to load bill details. Please try again.'));
      console.error('Error fetching bill details:', err);
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  // Process bill data to extract status information
  const processedBills = bills.map(bill => {
    // The OpenParliament API doesn't directly provide status/progress
    // We'll need to derive this from other fields or possibly get it from details
    
    // Default structure to match what our components expect
    return {
      ...bill,
      id: bill.url, // Use URL as unique ID
      number: bill.number,
      name: bill.name,
      introduced_date: bill.introduced,
      // The following fields need to be derived from bill details or set defaults
      status: "First Reading", // Default status - would need details API to get actual status
      sponsor: bill.sponsor_politician_url 
        ? `${bill.sponsor_politician_url.split('/').slice(-2, -1)[0].replace('-', ' ')}` 
        : "Unknown",
      last_event: `Introduced (${bill.introduced})`,
      progress: 20, // Default progress - would need details API to calculate
      session: bill.session
    };
  });

  return {
    bills: processedBills,
    rawBills: bills, // Also return the raw data
    loading,
    error,
    pagination,
    refresh,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    billDetails,
    detailsLoading,
    detailsError,
    fetchBillDetails,
  };
}

export default useBills;