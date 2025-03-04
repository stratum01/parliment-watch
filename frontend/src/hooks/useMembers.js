import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to fetch and manage members data from our backend API
 * @param {Object} options - Hook options
 * @param {number} options.limit - Number of members per page
 * @param {number} options.page - Page number for pagination
 * @returns {Object} - Members data and control functions
 */
function useMembers({ limit = 20, page = 1 } = {}) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page,
    limit,
    totalPages: 0,
    totalMembers: 0
  });

  // Transform OpenParliament API data to our frontend format
  const transformMember = (apiMember) => {
    // Fix image path - convert relative URL to absolute URL
    let photoUrl = apiMember.image || '';
    if (photoUrl && !photoUrl.startsWith('http')) {
      // Add the OpenParliament base URL to the image path
      photoUrl = `https://openparliament.ca${photoUrl}`;
    }
  
    // Extract contact info
    const email = apiMember.email || '';
    const phone = apiMember.voice || apiMember.phone || '';
  
    // Extract social media handles
    const twitter = apiMember.twitter || '';
  
    // Extract constituency offices
    const constituency_offices = [];
    if (apiMember.other_info && apiMember.other_info.constituency_offices) {
     // If it's a string, try to parse it
      if (typeof apiMember.other_info.constituency_offices === 'string') {
        constituency_offices.push(apiMember.other_info.constituency_offices);
      } else if (Array.isArray(apiMember.other_info.constituency_offices)) {
        constituency_offices.push(...apiMember.other_info.constituency_offices);
      }
    }
  
    return {
      id: apiMember.url,
      name: apiMember.name,
      party: apiMember.current_party?.short_name?.en || '',
      constituency: apiMember.current_riding?.name?.en || '',
      province: apiMember.current_riding?.province || '',
      email: email,
      phone: phone,
      photo_url: photoUrl || "/api/placeholder/400/400",
      roles: apiMember.roles || [],
      office: {
        address: apiMember.offices?.[0]?.postal || '',
        phone: apiMember.offices?.[0]?.tel || ''
      },
      // Add new fields
      twitter: twitter,
      constituency_offices: constituency_offices,
      wikipedia_id: apiMember.wikipedia_id || '',
      // Add the raw data for fields we might have missed
      data: apiMember
    };
  };

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
    
      // Use the API URL from .env
      const apiUrl = import.meta.env.VITE_API_URL || 'https://parliament-watch-api.fly.dev/api';
      const response = await fetch(`${apiUrl}/members`);
    
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
    
      const data = await response.json();
      console.log('Raw API response:', data); // For debugging
    
      // Check if the data contains an 'objects' array (typical OpenParliament format)
      const membersArray = data.objects || [];
    
      // Transform data to match the expected format
      const formattedMembers = membersArray.map(transformMember);
      console.log('Transformed members:', formattedMembers); // For debugging
    
      // Update members data
      setMembers(formattedMembers);
      
      // Update pagination if available
      if (data.pagination) {
        setPagination({
          page: Math.floor(data.pagination.offset / data.pagination.limit) + 1,
          limit: data.pagination.limit,
          totalPages: Math.ceil(data.pagination.count / data.pagination.limit) || 1,
          totalMembers: data.pagination.count || membersArray.length
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to load members data. Please try again.');
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Handle manual refresh
  const refresh = () => {
    fetchMembers();
  };

  // Handle pagination
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

  // Fetch a single member's details
  const [memberDetails, setMemberDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  const fetchMemberDetails = useCallback(async (memberId) => {
    if (!memberId) return null;
  
    try {
      setDetailsLoading(true);
      setDetailsError(null);
    
      // Extract member name from URL if it's a full URL path
      const memberName = memberId.includes('/') 
        ? memberId.split('/').filter(Boolean).pop() 
        : memberId;
    
      console.log('Fetching details for member:', memberName);
    
      const apiUrl = import.meta.env.VITE_API_URL || 'https://parliament-watch-api.fly.dev/api';
      const response = await fetch(`${apiUrl}/members/${memberName}`);
    
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
    
      const data = await response.json();
      console.log('Raw member details:', data); // For debugging
    
      // Transform the detailed member data
      const formattedMember = transformMember(data);
      console.log('Transformed member:', formattedMember); // For debugging
    
      setMemberDetails(formattedMember);
      return formattedMember; // Return the member details to the caller
    } catch (err) {
      console.error('Error fetching member details:', err);
      setDetailsError(err.message || 'Failed to load member details. Please try again.');
      return null; // Return null if there's an error
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  return {
    members,
    loading,
    error,
    pagination,
    refresh,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    memberDetails,
    detailsLoading,
    detailsError,
    fetchMemberDetails
  };
}

export default useMembers;