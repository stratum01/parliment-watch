// src/hooks/useMembers.js

import { useState, useEffect, useCallback } from 'react';
import { getMembers, getMemberDetails, getMemberVotes } from '../lib/api/openParliament';
import { parsePagination } from '../lib/paginationUtils';
import { handleAPIError } from '../lib/api/errorHandler';

/**
 * Hook to fetch and manage members data from the OpenParliament API
 * @param {Object} options - Hook options
 * @param {number} options.limit - Number of members per page
 * @param {number} options.initialOffset - Initial offset for pagination
 * @param {string} options.province - Province filter
 * @param {string} options.party - Party filter
 * @returns {Object} - Members data and control functions
 */
function useMembers({ limit = 20, initialOffset = 0, province = null, party = null } = {}) {
  const [members, setMembers] = useState([]);
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

  // Fetch members with current pagination and filters
  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getMembers({
        limit: pagination.limit,
        offset: pagination.offset,
        province,
        party,
      });
      
      // Update members data
      setMembers(data.objects || []);
      
      // Update pagination information
      const paginationData = data.pagination || {};
      setPagination(prev => ({
        ...prev,
        ...parsePagination(paginationData, prev.limit)
      }));
    } catch (err) {
      setError(handleAPIError(err, 'Failed to load members data. Please try again.'));
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit, pagination.offset, province, party]);

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

  // Fetch a single member's details
  const [memberDetails, setMemberDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  const fetchMemberDetails = useCallback(async (memberUrl) => {
    if (!memberUrl) return;
    
    try {
      setDetailsLoading(true);
      setDetailsError(null);
      
      const data = await getMemberDetails(memberUrl);
      setMemberDetails(data);
    } catch (err) {
      setDetailsError(handleAPIError(err, 'Failed to load member details. Please try again.'));
      console.error('Error fetching member details:', err);
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  // Fetch a member's voting history
  const [memberVotes, setMemberVotes] = useState([]);
  const [votesLoading, setVotesLoading] = useState(false);
  const [votesError, setVotesError] = useState(null);
  const [votesPagination, setVotesPagination] = useState({
    offset: 0,
    limit: 20,
    hasNext: false,
    hasPrevious: false,
    nextUrl: null,
    previousUrl: null,
  });

  const fetchMemberVotes = useCallback(async (memberUrl, offset = 0, limit = 20) => {
    if (!memberUrl) return;
    
    try {
      setVotesLoading(true);
      setVotesError(null);
      
      const data = await getMemberVotes(memberUrl, {
        offset,
        limit,
      });
      
      setMemberVotes(data.objects || []);
      
      // Update pagination information
      const paginationData = data.pagination || {};
      setVotesPagination({
        offset,
        limit,
        hasNext: !!paginationData.next_url,
        hasPrevious: !!paginationData.previous_url,
        nextUrl: paginationData.next_url,
        previousUrl: paginationData.previous_url,
      });
    } catch (err) {
      setVotesError(handleAPIError(err, 'Failed to load voting history. Please try again.'));
      console.error('Error fetching member votes:', err);
    } finally {
      setVotesLoading(false);
    }
  }, []);

  // Process member data for easier use in components
  const processedMembers = members.map(member => {
    return {
      id: member.url,
      name: member.name,
      party: member.current_party,
      constituency: member.current_riding,
      province: member.current_riding?.split(', ').pop(),
      email: member.email || null,
      phone: member.phone || null,
      photo_url: member.image || "/api/placeholder/400/400",
      roles: member.current_caucus_short ? [member.current_caucus_short] : [],
      office: {
        address: member.constituency_offices?.[0]?.postal || null,
        phone: member.constituency_offices?.[0]?.tel || null
      }
    };
  });

  return {
    members: processedMembers,
    rawMembers: members, // Also return the raw data
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
    fetchMemberDetails,
    memberVotes,
    votesLoading,
    votesError,
    votesPagination,
    fetchMemberVotes,
  };
}

export default useMembers;