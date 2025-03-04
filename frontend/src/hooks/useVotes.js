import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to fetch and manage votes data from our backend API
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
  
      // Use your backend API
      const apiUrl = import.meta.env.VITE_API_URL || 'https://parliament-watch-api.fly.dev/api';
      const response = await fetch(`${apiUrl}/votes?limit=${limit}&offset=${pagination.offset}`);
  
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
    
      const data = await response.json();
      console.log('Votes API response:', data);
      
      // Transform and set votes data
      const votesArray = data.objects || [];
      setVotes(votesArray);
      
      // Update pagination if available
      if (data.pagination) {
        setPagination({
          offset: pagination.offset,
          limit: pagination.limit,
          hasNext: !!data.pagination.next_url,
          hasPrevious: !!data.pagination.previous_url,
          nextUrl: data.pagination.next_url,
          previousUrl: data.pagination.previous_url,
          totalPages: Math.ceil((data.pagination.count || 0) / limit),
          currentPage: Math.floor(pagination.offset / limit) + 1,
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to load votes data. Please try again.');
      console.error('Error fetching votes:', err);
    } finally {
      setLoading(false);
    }
  }, [limit, pagination.offset]);

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

  const fetchVoteDetails = useCallback(async (voteId) => {
    if (!voteId) return;
    
    try {
      setDetailsLoading(true);
      setDetailsError(null);
      
      // Extract vote number from URL if needed
      const voteNumber = typeof voteId === 'string' && voteId.includes('/') 
        ? voteId.split('/').filter(Boolean).pop() 
        : voteId;
      
      const apiUrl = import.meta.env.VITE_API_URL || 'https://parliament-watch-api.fly.dev/api';
      const response = await fetch(`${apiUrl}/votes/${voteNumber}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      setVoteDetails(data);
    } catch (err) {
      setDetailsError(err.message || 'Failed to load vote details. Please try again.');
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