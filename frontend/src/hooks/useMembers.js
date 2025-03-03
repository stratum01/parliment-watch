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
  const transformMember = (apiMember) => {
    return {
      id: apiMember._id || apiMember.id || apiMember.url,
      name: apiMember.name,
      party: apiMember.party || apiMember.current_party,
      constituency: apiMember.constituency || apiMember.current_riding,
      province: apiMember.province,
      email: apiMember.email,
      phone: apiMember.phone,
      photo_url: apiMember.photo_url || apiMember.image || "/api/placeholder/400/400",
      roles: apiMember.roles || [],
      office: {
        address: apiMember.offices?.[0]?.address || apiMember.constituency_offices?.[0]?.postal || '',
        phone: apiMember.offices?.[0]?.phone || apiMember.constituency_offices?.[0]?.tel || ''
      }
    };
  };
// In useMembers.js, update the fetchMembers function:

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
    
      // Use your backend API instead of direct OpenParliament calls
      const response = await fetch(`${import.meta.env.VITE_API_URL}/members`);
    
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
    
      const data = await response.json();
    
      // Ensure we're working with an array of members  
      // The API might return { members: [...] } or just the array directly
      const membersArray = Array.isArray(data) ? data : (data.members || []);
    
      // Transform data to match the expected format
      const formattedMembers = membersArray.map(member => ({
        id: member._id || member.id,
        name: member.name || '',
        party: member.party || '',
        constituency: member.constituency || '',
        province: member.province || '',
        email: member.email || '',
        phone: member.phone || '',
        photo_url: member.photo_url || "/api/placeholder/100/100",
        roles: member.roles || [],
        office: {
          address: member.office?.address || '',
          phone: member.office?.phone || ''
        }
      }));
    
      // Update members data
      setMembers(formattedMembers);
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
    if (!memberId) return;
    
    try {
      setDetailsLoading(true);
      setDetailsError(null);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/members/${memberId}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      setMemberDetails(data);
    } catch (err) {
      setDetailsError(err.message || 'Failed to load member details. Please try again.');
      console.error('Error fetching member details:', err);
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