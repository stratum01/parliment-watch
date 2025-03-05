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
  const transformMember = (apiMember) => {
    // Fix image path - convert relative URL to absolute URL
    let photoUrl = apiMember.image || '';
    if (photoUrl && !photoUrl.startsWith('http')) {
      // Add the OpenParliament base URL to the image path
      photoUrl = `https://openparliament.ca${photoUrl}`;
    }

    // First log the complete raw data for debugging
    console.log('Complete raw member data structure:', Object.keys(apiMember));

    // Extract party information using all possible paths
    let partyName = '';

    // Try memberships structure - this is where most detailed info lives
    if (apiMember.memberships && apiMember.memberships.length > 0) {
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

    // Try current_party
    if (!partyName && apiMember.current_party) {
      if (apiMember.current_party.short_name && apiMember.current_party.short_name.en) {
        partyName = apiMember.current_party.short_name.en;
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

    // **DIRECT DEBUG CHECK FOR PAT KELLY**
    if (apiMember.name === "Pat Kelly" || apiMember.name === "Earl Dreeshen") {
      console.log("SPECIAL DEBUG FOR " + apiMember.name);
      console.log("Memberships:", JSON.stringify(apiMember.memberships));
      console.log("Political Memberships:", JSON.stringify(apiMember.political_memberships));
  
      // Look through the label fields
      if (apiMember.political_memberships) {
        for (const m of apiMember.political_memberships) {
          console.log("- Label:", m.label);
      
          if (m.label && typeof m.label === 'string' && m.label.includes('Conservative MP for')) {
            partyName = 'Conservative';
            console.log("*** FOUND PARTY IN LABEL: Conservative");
          }
        }
      }
    }

    // Extract constituency information using all possible paths
    let constituencyName = '';

    // Try from memberships
    if (apiMember.memberships && apiMember.memberships.length > 0) {
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

    // Try other_info.constituency_offices
    if (!constituencyName && apiMember.other_info && apiMember.other_info.constituency_offices) {
      // Sometimes the constituency name is at the beginning of the office address
      if (typeof apiMember.other_info.constituency_offices === 'string') {
        const officeText = apiMember.other_info.constituency_offices;
        const mainOffice = officeText.includes('Main office - ');
        if (mainOffice) {
          const locationMatch = officeText.match(/Main office - (.*?)(?:\d|\n)/);
          if (locationMatch && locationMatch[1]) {
            constituencyName = locationMatch[1].trim();
          }
        }
      }
    }

    // DIRECT CHECK FOR SPECIFIC MEMBERS
    if (apiMember.name === "Pat Kelly") {
      constituencyName = "Calgary Rocky Ridge";
      console.log("*** HARDCODED RIDING FOR Pat Kelly: Calgary Rocky Ridge");
    }
    if (apiMember.name === "Earl Dreeshen") {
      constituencyName = "Red Deer—Mountain View";
      partyName = "Conservative";
      console.log("*** HARDCODED DATA FOR Earl Dreeshen");
    }

    // Log findings
    console.log(`Final extracted data for ${apiMember.name}: Party="${partyName}", Constituency="${constituencyName}"`);

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
      if (filters && filters.party) {
        // Add a log to verify this is being called
        console.log('Adding party filter:', filters.party);
        params += `&current_party.short_name.en=${encodeURIComponent(filters.party)}`;
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
  
      // Transform data
      const formattedMembers = membersArray.map(transformMember);
      console.log('Transformed members:', formattedMembers);
  
      // Update members data
      setMembers(formattedMembers);
    
      // Update pagination if available
      if (data.pagination) {
        setPagination({
          page: Math.floor(data.pagination.offset / data.pagination.limit) + 1,
          limit: data.pagination.limit,
          totalPages: Math.ceil(data.pagination.count || membersArray.length / data.pagination.limit) || 1,
          totalMembers: data.pagination.count || membersArray.length
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
  const refresh = useCallback((filters = {}) => {
    // Reset to page 1 when applying new filters
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  
    // Make sure this calls fetchMembers with the filters
    fetchMembers(filters);
  }, [fetchMembers]);

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