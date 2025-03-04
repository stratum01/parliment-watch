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

    // Extract party information from political_memberships
    let partyName = '';

    // First check for political_memberships
    if (apiMember.political_memberships && apiMember.political_memberships.length > 0) {
      // Loop through memberships to find valid party info
      for (const membership of apiMember.political_memberships) {
        if (membership.party) {
          // Try label first, then short_name
          if (membership.party.label) {
            if (typeof membership.party.label === 'string') {
              partyName = membership.party.label;
              break;
            } else if (membership.party.label.en) {
              partyName = membership.party.label.en;
              break;
            }
          }
      
          // Try short_name
          if (!partyName && membership.party.short_name) {
            if (typeof membership.party.short_name === 'string') {
              partyName = membership.party.short_name;
              break;
            } else if (membership.party.short_name.en) {
              partyName = membership.party.short_name.en;
              break;
            }
          }
        }
      }
    }

    // If party is still not found, check labels directly in memberships
    if (!partyName && apiMember.political_memberships &&     apiMember.political_memberships.length > 0) {
      for (const membership of apiMember.political_memberships) {
        if (membership.label && typeof membership.label === 'string' && membership.label.includes('MP for')) {
          const partyMatch = membership.label.match(/Conservative|Liberal|NDP|Green|Bloc/);
          if (partyMatch) {
            partyName = partyMatch[0];
            break;
          }
        }
      }
    }

    // Extract party information - handle ALL other possible formats if not found
    if (!partyName) {
      if (typeof apiMember.party === 'string' && apiMember.party) {
        partyName = apiMember.party;
      } else if (apiMember.current_party && apiMember.current_party.short_name && apiMember.current_party.short_name.en) {
        partyName = apiMember.current_party.short_name.en;
      } else if (apiMember.party && typeof apiMember.party === 'object' && apiMember.party.short_name) {
        partyName = typeof apiMember.party.short_name === 'string' 
          ? apiMember.party.short_name 
          : apiMember.party.short_name?.en || '';
      } else if (apiMember.other_info && apiMember.other_info.party) {
        partyName = apiMember.other_info.party;
      }
    }

    // Extract constituency information from memberships
    let constituencyName = '';

    // First check for political_memberships
    if (apiMember.political_memberships && apiMember.political_memberships.length > 0) {
      // Loop through memberships to find valid riding info
      for (const membership of apiMember.political_memberships) {
        if (membership.riding) {
          if (membership.riding.name) {
            if (typeof membership.riding.name === 'string') {
              constituencyName = membership.riding.name;
              break;
            } else if (membership.riding.name.en) {
              constituencyName = membership.riding.name.en;
              break;
            }
          }
        }
    
        // Try extracting from label
        if (!constituencyName && membership.label && typeof membership.label === 'string') {
          const match = membership.label.match(/MP for (.+?)(?:$|\))/);
          if (match && match[1]) {
            constituencyName = match[1].trim();
            break;
          }
        }
      }
    }

    // Extract constituency information - handle ALL other possible formats if not found
    if (!constituencyName) {
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
    }

    // Also check for "energy" or other buttons that might appear
    const energyTag = apiMember.other_info?.wordcloud_id === 'energy';
    console.log(`Member: ${apiMember.name}, Party: "${partyName}", Constituency: "${constituencyName}", Energy: ${energyTag}`);

    // Extract province
    let provinceCode = '';
  
    // Check political_memberships first
    if (apiMember.political_memberships && apiMember.political_memberships.length > 0) {
      const membership = apiMember.political_memberships[0]; // Use the most recent membership
      if (membership.riding && membership.riding.province) {
        provinceCode = membership.riding.province;
      }
    }
  
    // If not found, try other locations
    if (!provinceCode) {
      if (typeof apiMember.province === 'string' && apiMember.province) {
        provinceCode = apiMember.province;
      } else if (apiMember.current_riding && apiMember.current_riding.province) {
        provinceCode = apiMember.current_riding.province;
      } else if (apiMember.riding && typeof apiMember.riding === 'object' && apiMember.riding.province) {
        provinceCode = apiMember.riding.province;
      }
    }

    // Extract contact info
    const email = apiMember.email || '';
    const phone = apiMember.voice || apiMember.phone || '';

    // Extract constituency office details using multiple possible paths
    let constituencyOfficeAddress = '';
    let constituencyOfficePhone = '';
  
    // Check constituency_offices in other_info
    if (apiMember.other_info && apiMember.other_info.constituency_offices) {
      if (typeof apiMember.other_info.constituency_offices === 'string') {
        constituencyOfficeAddress = apiMember.other_info.constituency_offices;
      } else if (Array.isArray(apiMember.other_info.constituency_offices) && apiMember.other_info.constituency_offices.length > 0) {
        constituencyOfficeAddress = apiMember.other_info.constituency_offices[0];
      }
    }
   
    // Check main office field
    if (apiMember.other_info && apiMember.other_info.main_office) {
      constituencyOfficeAddress = apiMember.other_info.main_office;
    }

    // Build a proper constituency office object
    let constituencyOffice = {
      address: constituencyOfficeAddress,
      phone: constituencyOfficePhone
    };

    // Extract Twitter handle from multiple possible locations
    let twitterHandle = '';
    if (apiMember.twitter) {
      twitterHandle = apiMember.twitter;
    } else if (apiMember.other_info && apiMember.other_info.twitter_id) {
      twitterHandle = apiMember.other_info.twitter_id;
    } else if (apiMember.other_info && apiMember.other_info.twitter) {
      twitterHandle = apiMember.other_info.twitter;
    }
   
    let favoriteWord = '';
    if (apiMember.other_info && apiMember.other_info.favourite_word) {
      if (typeof apiMember.other_info.favourite_word === 'string') {
        favoriteWord = apiMember.other_info.favourite_word;
      } else if (Array.isArray(apiMember.other_info.favourite_word) && apiMember.other_info.favourite_word.length > 0) {
        favoriteWord = apiMember.other_info.favourite_word[0];
      }
    }

    // Log what we found for debugging
    console.log(`Member: ${apiMember.name}, Party: "${partyName}", Constituency: "${constituencyName}", Province: "${provinceCode}"`);
  
    // Create a clean URL to send back to our API
    const cleanedUrl = apiMember.url || '';

    return {
      id: apiMember.url,
      name: apiMember.name || '',
      party: partyName || 'Unknown Party',
      constituency: constituencyName || 'Unknown Constituency',
      province: provinceCode || '',
      email: apiMember.email || '',
      phone: apiMember.voice || phone || '',
      photo_url: photoUrl || "/api/placeholder/400/400",
      roles: apiMember.roles || [],
      office: {
        address: apiMember.offices?.[0]?.postal || '',
        phone: apiMember.offices?.[0]?.tel || ''
      },
      constituency_office: constituencyOffice,
      twitter: twitterHandle,
      favorite_word: favoriteWord,
      wikipedia_id: apiMember.wikipedia_id || apiMember.other_info?.wikipedia_id || '',
      // Add the raw data for fields we might have missed
      data: apiMember,
      // For debug purposes only
      debug: {
        rawParty: apiMember.party,
        rawConstituency: apiMember.constituency,
        rawCurrentParty: apiMember.current_party,
        rawCurrentRiding: apiMember.current_riding,
        politicalMemberships: apiMember.political_memberships || [],
        otherInfo: apiMember.other_info || {}
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