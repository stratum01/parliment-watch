// src/hooks/useVotes.js

import { useState, useEffect, useCallback } from 'react';
import { getVotes, getVoteDetails } from '../lib/api/openParliament';
import { parsePagination } from '../lib/paginationUtils';
import { handleAPIError } from '../lib/api/errorHandler';

/**
 * Hook to fetch and manage votes data from the OpenParliament API
 * @param {Object} options - Hook options
 * @param {number} options.limit - Number of votes per page
 * @param {number} options.initialOffset - Initial offset for pagination
 * @param {string} options.session - Parliamentary session to filter by
 * @returns {Object} - Votes data and control functions
 */
function useVotes({ limit = 20, initialOffset = 0, session = null } = {}) {
  const [votes, setVotes] = useState([]);
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

  // Fetch votes with current pagination and filters
  const fetchVotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getVotes({
        limit: pagination.limit,
        offset: pagination.offset,
        session,
      });
      
      // Update votes data
      setVotes(data.objects || []);
      
      // Update pagination information
      const paginationData = data.pagination || {};
      setPagination(prev => ({
        ...prev,
        ...parsePagination(paginationData, prev.limit)
      }));
    } catch (err) {
      setError(handleAPIError(err, 'Failed to load votes data. Please try again.'));
      console.error('Error fetching votes:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit, pagination.offset, session]);

  // Initial data fetch
  useEffect(() => {
    fetchVotes();
  }, [fetchVotes]);

  // Handle manual refresh
  const refresh = () => {
    fetchVotes();
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

  // Fetch a single vote's details
  const [voteDetails, setVoteDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  const fetchVoteDetails = useCallback(async (voteUrl) => {
    if (!voteUrl) return;
    
    try {
      setDetailsLoading(true);
      setDetailsError(null);
      
      const data = await getVoteDetails(voteUrl);
      setVoteDetails(data);
    } catch (err) {
      setDetailsError(handleAPIError(err, 'Failed to load vote details. Please try again.'));
      console.error('Error fetching vote details:', err);
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  return {
    votes,
    loading,
    error,
    pagination,
    refresh,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    voteDetails,
    detailsLoading,
    detailsError,
    fetchVoteDetails,
  };
}

export default useVotes;