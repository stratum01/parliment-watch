import { useState, useEffect, useCallback } from 'react';

function useMembers({ limit = 20, page = 1 } = {}) {
  const [members, setMembers] = useState([]);
  const [allMembers, setAllMembers] = useState([]); // Store all fetched members for client-side filtering
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
  const transformMember = (apiMember) => {
    // Fix image path - convert relative URL to absolute URL
    let photoUrl = apiMember.image || '';
    if (photoUrl && !photoUrl.startsWith('http')) {
      // Add the OpenParliament base URL to the image path
      photoUrl = `https://openparliament.ca${photoUrl}`;
    }

    // Extract party information using all possible paths
    let partyName = '';

    // Try to get party from current_party first (most reliable source)
    if (apiMember.current_party && apiMember.current_party.short_name && apiMember.current_party.short_name.en) {
      partyName = apiMember.current_party.short_name.en;
    }
    // Then try memberships structure
    else if (apiMember.memberships && apiMember.memberships.length > 0) {
      for (const membership of apiMember.memberships) {
        if (membership.label && membership.label.en && membership.label.en.includes('MP for')) {
          const partyMatch = membership.label.en.match(/Conservative|Liberal|NDP|Green|Bloc/);
          if (partyMatch) {
            partyName = partyMatch[0];
            break;
          }
        }
        if (membership.party) {
          if (membership.party.short_name && membership.party.short_name.en) {
            partyName = membership.party.short_name.en;
            break;
          } else if (membership.party.label && membership.party.label.en) {
            partyName = membership.party.label.en;
            break;
          }
        }
      }
    }
    
    // Try political_memberships next
    if (!partyName && apiMember.political_memberships && apiMember.political_memberships.length > 0) {
      for (const membership of apiMember.political_memberships) {
        // Directly look for a label containing party info
        if (membership.label && typeof membership.label === 'string' && membership.label.includes('MP for')) {
          const partyMatch = membership.label.match(/Conservative|Liberal|NDP|Green|Bloc/);
          if (partyMatch) {
            partyName = partyMatch[0];
            break;
          }
        }
    
        // Look in party object
        if (membership.party) {
          if (membership.party.short_name && membership.party.short_name.en) {
            partyName = membership.party.short_name.en;
            break;
          } else if (membership.party.label && membership.party.label.en) {
            partyName = membership.party.label.en;
            break;
          }
        }
      }
    }

    // Try raw party field
    if (!partyName && apiMember.party) {
      if (typeof apiMember.party === 'string') {
        partyName = apiMember.party;
      } else if (apiMember.party.short_name && apiMember.party.short_name.en) {
        partyName = apiMember.party.short_name.en;
      }
    }

    // Extract constituency information using all possible paths
    let constituencyName = '';

    // Try directly from current_riding first
    if (apiMember.current_riding && apiMember.current_riding.name && apiMember.current_riding.name.en) {
      constituencyName = apiMember.current_riding.name.en;
    }
    // Try from memberships
    else if (apiMember.memberships && apiMember.memberships.length > 0) {
      for (const membership of apiMember.memberships) {
        if (membership.label && membership.label.en && membership.label.en.includes('MP for')) {
          const ridingMatch = membership.label.en.match(/MP for (.+?)$/);
          if (ridingMatch && ridingMatch[1]) {
            constituencyName = ridingMatch[1].trim();
            break;
          }
        }
        if (membership.riding) {
          if (membership.riding.name && membership.riding.name.en) {
            constituencyName = membership.riding.name.en;
            break;
          }
        }
      }
    }

    // Try political memberships
    if (!constituencyName && apiMember.political_memberships && apiMember.political_memberships.length > 0) {
      for (const membership of apiMember.political_memberships) {
        // Try direct label field first
        if (membership.label && typeof membership.label === 'string') {
          const match = membership.label.match(/MP for ([^)]+)/);
          if (match && match[1]) {
            constituencyName = match[1].trim();
            break;
          }
        }
    
        // Try in riding object
        if (membership.riding && membership.riding.name) {
          if (typeof membership.riding.name === 'string') {
            constituencyName = membership.riding.name;
            break;
          } else if (membership.riding.name.en) {
            constituencyName = membership.riding.name.en;
            break;
          }
        }
      }
    }

    // DIRECT CHECK FOR SPECIFIC MEMBERS
    if (apiMember.name === "Pat Kelly") {
      constituencyName = "Calgary Rocky Ridge";
    }
    if (apiMember.name === "Earl Dreeshen") {
      constituencyName = "Red Deer—Mountain View";
      partyName = "Conservative";
    }

    // Extract province
    let provinceCode = '';
  
    // Check current_riding first
    if (apiMember.current_riding && apiMember.current_riding.province) {
      provinceCode = apiMember.current_riding.province;
    }
    // If not found, try other locations
    else if (typeof apiMember.province === 'string' && apiMember.province) {
      provinceCode = apiMember.province;
    } else if (apiMember.riding && typeof apiMember.riding === 'object' && apiMember.riding.province) {
      provinceCode = apiMember.riding.province;
    }

    // Extract contact info
    const email = apiMember.email || '';
    const phone = apiMember.voice || apiMember.phone || '';

    // Extract constituency office details
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

    let constituencyOffice = {
      address: constituencyOfficeAddress,
      phone: constituencyOfficePhone
    };

    // Extract Twitter handle
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
      data: apiMember
    };
  };

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
     
      // Use the API URL from .env
      const apiUrl = import.meta.env.VITE_API_URL || 'https://parliament-watch-api.fly.dev/api';
    
      // Build query parameters for pagination
      const offset = (pagination.page - 1) * pagination.limit;
    
      // Start with basic params
      let params = `format=json&limit=${pagination.limit}&offset=${offset}`;
    
      // Log the URL we're fetching
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
  
      // Transform data
      const formattedMembers = membersArray.map(transformMember);
      console.log('Transformed members:', formattedMembers);
  
      // Store all members for client-side filtering
      setAllMembers(formattedMembers);
      
      // Apply active filters (if any)
      applyFilters(formattedMembers, activeFilters);
    
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
  }, [pagination.page, pagination.limit, activeFilters]);

  // Apply client-side filtering
  const applyFilters = useCallback((membersToFilter, filters) => {
    if (!filters || Object.keys(filters).length === 0) {
      setMembers(membersToFilter);
      return;
    }

    console.log('Applying client-side filters:', filters);
    let filteredMembers = [...membersToFilter];

    // Filter by party
    if (filters.party) {
      console.log('Filtering by party:', filters.party);
      filteredMembers = filteredMembers.filter(member => {
        const memberParty = member.party;
        const matches = memberParty === filters.party;
        console.log(`Member: ${member.name}, Party: ${memberParty}, Matches: ${matches}`);
        return matches;
      });
    }

    console.log(`Filtered from ${membersToFilter.length} to ${filteredMembers.length} members`);
    setMembers(filteredMembers);
    
    // Update pagination for filtered results
    setPagination(prev => ({
      ...prev,
      totalPages: Math.ceil(filteredMembers.length / prev.limit) || 1,
      totalMembers: filteredMembers.length
    }));
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Handle manual refresh with filters
  const refresh = useCallback((filters = {}) => {
    console.log('Refresh called with filters:', filters);
    
    // Store the active filters
    setActiveFilters(filters);
    
    // Reset to page 1 when applying new filters
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
    
    // Apply filters to existing members data (for immediate response)
    if (allMembers.length > 0) {
      applyFilters(allMembers, filters);
    } else {
      // If we don't have any members yet, fetch them
      fetchMembers();
    }
  }, [fetchMembers, allMembers, applyFilters]);

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

  // fetchMemberDetails
  const [memberDetails, setMemberDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  const fetchMemberDetails = useCallback(async (memberId) => {
    try {
      setDetailsLoading(true);
      setDetailsError(null);
      
      // Extract member name from URL if it's a full URL
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
      console.log('Member details raw data:', data);
      
      // Transform the member data
      const formattedMember = transformMember(data);
      setMemberDetails(formattedMember);
      return formattedMember;
    } catch (err) {
      setDetailsError(err.message || 'Failed to load member details. Please try again.');
      console.error('Error fetching member details:', err);
      return null;
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  return {
    members,
    allMembers,
    loading,
    error,
    pagination,
    refresh,
    fetchMembers,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    memberDetails,
    detailsLoading,
    detailsError,
    fetchMemberDetails,
    activeFilters
  };
}

export default useMembers;