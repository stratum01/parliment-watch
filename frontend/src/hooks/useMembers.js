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
 
    // Log the raw member data to see all available fields
    console.log('Complete raw member data:', JSON.stringify(apiMember));

    // Extract party information - handle ALL possible formats
    let partyName = '';
    if (typeof apiMember.party === 'string' && apiMember.party) {
      partyName = apiMember.party;
    } else if (apiMember.current_party && apiMember.current_party.short_name &&   apiMember.current_party.short_name.en) {
      partyName = apiMember.current_party.short_name.en;
    } else if (apiMember.party && typeof apiMember.party === 'object' &&   apiMember.party.short_name) {
      partyName = typeof apiMember.party.short_name === 'string' 
        ? apiMember.party.short_name 
        : apiMember.party.short_name?.en || '';
    } else if (apiMember.other_info && apiMember.other_info.party) {
      partyName = apiMember.other_info.party;
    }

    // Extract constituency information - handle ALL possible formats
    let constituencyName = '';
    if (typeof apiMember.constituency === 'string' && apiMember.constituency) {
      constituencyName = apiMember.constituency;
    } else if (apiMember.current_riding && apiMember.current_riding.name && apiMember.current_riding.name.en) {
      constituencyName = apiMember.current_riding.name.en;
    } else if (apiMember.riding && typeof apiMember.riding === 'string') {
      constituencyName = apiMember.riding;
    } else if (apiMember.riding && typeof apiMember.riding === 'object' && apiMember.riding.name) {
      constituencyName = typeof apiMember.riding.name === 'string' 
        ? apiMember.riding.name 
        : apiMember.riding.name?.en || '';
    } else if (apiMember.other_info && apiMember.other_info.constituency) {
      constituencyName = apiMember.other_info.constituency;
    }

    // Extract province
    let provinceCode = '';
    if (typeof apiMember.province === 'string' && apiMember.province) {
      provinceCode = apiMember.province;
    } else if (apiMember.current_riding && apiMember.current_riding.province) {
      provinceCode = apiMember.current_riding.province;
    } else if (apiMember.riding && typeof apiMember.riding === 'object' && apiMember.riding.province) {
      provinceCode = apiMember.riding.province;
    }

    // Extract contact info
    const email = apiMember.email || '';
    const phone = apiMember.voice || apiMember.phone || '';

    // Extract constituency office details using multiple possible paths
    let constituencyOfficeAddress = '';
    let constituencyOfficePhone = '';
  
    if (apiMember.constituency_offices && apiMember.constituency_offices.length > 0) {
      const mainOffice = apiMember.constituency_offices[0];
      constituencyOfficeAddress = mainOffice.postal || mainOffice.address || '';
      constituencyOfficePhone = mainOffice.tel || mainOffice.phone || '';
    } else if (apiMember.other_info && apiMember.other_info.constituency_offices) {
      if (typeof apiMember.other_info.constituency_offices === 'string') {
        constituencyOfficeAddress = apiMember.other_info.constituency_offices;
      }
    }

    // Extract all metadata from other_info to ensure we don't miss anything
    const otherInfo = apiMember.other_info || {};
  
    // Build a proper constituency office object
    let constituencyOffice = {
      address: constituencyOfficeAddress,
      phone: constituencyOfficePhone
    };

    // If we have constituency_offices field as a structured field, extract it properly
    const constituency_offices = [];
    if (apiMember.other_info && apiMember.other_info.constituency_offices) {
      if (typeof apiMember.other_info.constituency_offices === 'string') {
        constituency_offices.push(apiMember.other_info.constituency_offices);
      } else if (Array.isArray(apiMember.other_info.constituency_offices)) {
        constituency_offices.push(...apiMember.other_info.constituency_offices);
      }
    }

    // Log what we found for debugging
    console.log(`Member: ${apiMember.name}, Party: "${partyName}", Constituency: "${constituencyName}", Province: "${provinceCode}"`);

    return {
      id: apiMember.url,
      name: apiMember.name || '',
      party: partyName || 'Unknown Party',
      constituency: constituencyName || 'Unknown Constituency',
      province: provinceCode || '',
      email: email,
      phone: phone,
      photo_url: photoUrl || "/api/placeholder/400/400",
      roles: apiMember.roles || [],
      office: {
        address: apiMember.offices?.[0]?.postal || '',
        phone: apiMember.offices?.[0]?.tel || ''
      },
      constituency_office: constituencyOffice,
      constituency_offices: constituency_offices,
      twitter: apiMember.twitter || otherInfo.twitter || '',
      wikipedia_id: apiMember.wikipedia_id || otherInfo.wikipedia_id || '',
      // Add the raw data for fields we might have missed
      data: apiMember,
      // For debug purposes only
      debug: {
        rawParty: apiMember.party,
        rawConstituency: apiMember.constituency,
        rawCurrentParty: apiMember.current_party,
        rawCurrentRiding: apiMember.current_riding,
        rawOtherInfo: otherInfo
      }
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