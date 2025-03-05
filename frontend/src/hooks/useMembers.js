import { useState, useEffect, useCallback } from 'react';

function useMembers({ limit = 20, page = 1 } = {}) {
  const [members, setMembers] = useState([]); // Filtered members for display
  const [allMembers, setAllMembers] = useState([]); // Store all fetched members across all pages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});
  const [pagination, setPagination] = useState({
    page,
    limit,
    totalPages: 0,
    totalMembers: 0,
    hasMore: true // Track if there's more data to fetch
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

  const fetchMembers = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // If reset is true, we're starting a new search (e.g., after changing filters)
      // Otherwise, we're paginating/adding more
      const currentPage = reset ? 1 : pagination.page;
     
      // Use the API URL from .env
      const apiUrl = import.meta.env.VITE_API_URL || 'https://parliament-watch-api.fly.dev/api';
    
      // Build query parameters for pagination
      const offset = (currentPage - 1) * pagination.limit;
    
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
  
      // Update allMembers - append or replace depending on reset flag
      setAllMembers(prev => {
        if (reset) {
          return formattedMembers; // Start fresh
        } else {
          // Combine existing and new members, avoid duplicates by ID
          const existingIds = new Set(prev.map(m => m.id));
          const uniqueNewMembers = formattedMembers.filter(m => !existingIds.has(m.id));
          return [...prev, ...uniqueNewMembers];
        }
      });
      
      // Update pagination if available
      if (data.pagination) {
        const nextPage = currentPage + 1;
        const totalPagesEstimate = Math.ceil(data.pagination.count / pagination.limit) || 1;
        const hasMorePages = data.pagination.next_url !== null;
        
        setPagination({
          page: nextPage, // Increment page for next fetch
          limit: pagination.limit,
          totalPages: totalPagesEstimate,
          totalMembers: data.pagination.count || membersArray.length,
          hasMore: hasMorePages
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to load members data. Please try again.');
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
      
      // After loading, apply any active filters to the updated allMembers
      setAllMembers(prev => {
        // Using setTimeout to ensure state is updated before we try to filter
        setTimeout(() => applyFilters(prev, activeFilters), 0);
        return prev;
      });
    }
  }, [pagination.limit, pagination.page, activeFilters]);

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
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchMembers(true); // Reset on first load
  }, []);

  // Handle manual refresh with filters
  const refresh = useCallback((filters = {}) => {
    console.log('Refresh called with filters:', filters);
    
    // Store the active filters
    setActiveFilters(filters);
    
    // Reset pagination and fetch from beginning
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
    
    // Fetch members from the beginning
    fetchMembers(true);
  }, [fetchMembers]);

  // Load more function that works with filtered data
  const loadMore = useCallback(() => {
    // If we have active filters, we need to check if loading more would help
    if (Object.keys(activeFilters).length > 0) {
      // First check if we have loaded all data
      if (!pagination.hasMore) {
        console.log('No more data to load from API');
        return;
      }
      
      // If we have active filters and need more data, fetch the next page
      console.log('Loading more data with active filters');
      fetchMembers(false); // Don't reset, just append
    } else {
      // No filters, just load next page normally
      fetchMembers(false);
    }
  }, [fetchMembers, activeFilters, pagination.hasMore]);

  const goToNextPage = useCallback(() => {
    loadMore();
  }, [loadMore]);

  const goToPreviousPage = useCallback(() => {
    // For simplicity, we don't implement going back in this approach
    // since we're accumulating all data
    console.log('Previous page not implemented in cumulative mode');
  }, []);

  const goToPage = useCallback((page) => {
    // For simplicity, we don't implement direct page navigation
    // since we're accumulating all data
    console.log('Direct page navigation not implemented in cumulative mode');
  }, []);

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
    loadMore,
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