import { useState, useEffect, useCallback } from 'react';

function useMembers({ limit = 20, page = 1 } = {}) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});
  const [pagination, setPagination] = useState({
    page,
    limit,
    totalPages: 0,
    totalMembers: 0
  });

  // Transform OpenParliament API data to our frontend format
  // (Your existing transformMember function remains unchanged)
  const transformMember = (apiMember) => {
    // Existing transformation code...
  };

  // Modified fetchMembers to accept filters
  const fetchMembers = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
    
      // Store active filters
      setActiveFilters(filters);
  
      // Use the API URL from .env
      const apiUrl = import.meta.env.VITE_API_URL || 'https://parliament-watch-api.fly.dev/api';
    
      // Build query parameters for pagination
      const offset = (pagination.page - 1) * pagination.limit;
    
      // Start with basic params
      let params = `format=json&limit=${pagination.limit}&offset=${offset}`;
    
      // Add party filter if provided
      if (filters.party) {
        // The API seems to expect a 'current_party.short_name.en' filter
        // But this might not be directly supported in the URL structure
      
        // First try our proxy API if it supports party filtering
        params += `&party=${encodeURIComponent(filters.party)}`;
      
        // If your proxy API doesn't support this, you might need to 
        // fetch all and filter client-side, or implement a server-side filter
      }
    
      const url = `${apiUrl}/members?${params}`;
      console.log('Fetching members with URL:', url);
    
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Raw API response:', data);
  
      // Check if the data contains an 'objects' array
      const membersArray = data.objects || [];
  
      // If API-level filtering didn't work, we could filter client-side as a fallback
      let filteredMembers = membersArray;
      if (filters.party && !url.includes('&party=')) {
        filteredMembers = membersArray.filter(member => {
          // Check nested structure based on API response
          const partyName = member.current_party?.short_name?.en || 
                            member.party?.short_name?.en ||
                            '';
          return partyName === filters.party;
        });
      }
  
      // Transform data
      const formattedMembers = filteredMembers.map(transformMember);
      console.log('Transformed members:', formattedMembers);
  
      // Update members data
      setMembers(formattedMembers);
    
      // Update pagination if available
      if (data.pagination) {
        setPagination({
          page: Math.floor(data.pagination.offset / data.pagination.limit) + 1,
          limit: data.pagination.limit,
          totalPages: Math.ceil(data.pagination.count || filteredMembers.length / data.pagination.limit) || 1,
          totalMembers: data.pagination.count || filteredMembers.length
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to load members data. Please try again.');
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  // Initial data fetch
  useEffect(() => {
    fetchMembers(activeFilters);
  }, [fetchMembers, pagination.page, pagination.limit]);

  // Handle manual refresh with filters
  const refresh = (filters = {}) => {
    // Reset to page 1 when applying new filters
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
    
    // Fetch with the new filters
    fetchMembers(filters);
  };

  // Handle pagination functions (goToNextPage, goToPreviousPage, goToPage)
  // These remain the same but will now use activeFilters when fetching
  
  const goToNextPage = useCallback(() => {
    if (pagination.page < pagination.totalPages) {
      setPagination(prev => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  }, [pagination.page, pagination.totalPages]);

  const goToPreviousPage = useCallback(() => {
    if (pagination.page > 1) {
      setPagination(prev => ({
        ...prev,
        page: prev.page - 1,
      }));
    }
  }, [pagination.page]);

  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({
        ...prev,
        page,
      }));
    }
  }, [pagination.totalPages]);

  // fetchMemberDetails remains unchanged
  const [memberDetails, setMemberDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  const fetchMemberDetails = useCallback(async (memberId) => {
    // Existing implementation...
  }, []);

  return {
    members,
    loading,
    error,
    pagination,
    refresh,             // Now supports filter parameters
    fetchMembers,        // Now supports filter parameters
    goToNextPage,
    goToPreviousPage,
    goToPage,
    memberDetails,
    detailsLoading,
    detailsError,
    fetchMemberDetails,
    activeFilters         // Added to return active filters
  };
}

export default useMembers;