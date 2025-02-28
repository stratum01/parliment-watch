import cache from '../cache';
import { createAPIError, APIError } from './errorHandler';

// Using our Nginx proxy path instead of direct API URL
const API_BASE_URL = '/api/openparliament';

// Cache TTLs
const CACHE_TTL = {
  LIST: 5 * 60 * 1000, // 5 minutes for list endpoints
  DETAIL: 30 * 60 * 1000, // 30 minutes for detail endpoints
  MEMBER_VOTES: 10 * 60 * 1000, // 10 minutes for member votes
};

/**
 * Fetches data from the OpenParliament API with proper error handling and caching
 * @param {string} endpoint - API endpoint to fetch from
 * @param {Object} params - Query parameters
 * @param {number} ttl - Cache time to live in milliseconds
 * @returns {Promise<Object>} - Parsed JSON response
 */
async function fetchFromAPI(endpoint, params = {}, ttl = CACHE_TTL.LIST) {
  // Build URL with query parameters
  const url = new URL(endpoint, window.location.origin + API_BASE_URL);
  
  // Always request JSON format
  url.searchParams.append('format', 'json');
  
  // Add API version parameter
  url.searchParams.append('version', 'v1');
  
  // Add any additional parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });
  
  // Generate cache key from URL and parameters
  const cacheKey = url.toString();
  
  // Check if we have a cached response
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    // Headers managed by the Nginx proxy
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw await createAPIError(response, endpoint);
    }
    
    const data = await response.json();
    
    // Cache the response
    cache.set(cacheKey, data, ttl);
    
    return data;
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    
    // If it's already an APIError, rethrow it
    if (error instanceof APIError) {
      throw error;
    }
    
    // Otherwise, create a new APIError
    throw new APIError(
      error.message || 'Failed to fetch data',
      0, // Unknown status code
      endpoint,
      { originalError: error }
    );
  }
}

/**
 * Get a list of bills with pagination
 * @param {Object} options - Options for the request
 * @param {number} options.limit - Number of items per page
 * @param {number} options.offset - Offset for pagination
 * @param {string} options.session - Filter by parliamentary session
 * @returns {Promise<Object>} - List of bills with pagination info
 */
export async function getBills({ limit = 20, offset = 0, session = null } = {}) {
  const params = {
    limit,
    offset,
    session,
  };
  
  return fetchFromAPI('/bills/', params);
}

/**
 * Get details for a specific bill
 * @param {string} billUrl - The URL path for the bill (e.g., "/bills/44-1/C-32/")
 * @returns {Promise<Object>} - Bill details
 */
export async function getBillDetails(billUrl) {
  return fetchFromAPI(billUrl, {}, CACHE_TTL.DETAIL);
}

/**
 * Get a list of votes with pagination
 * @param {Object} options - Options for the request
 * @param {number} options.limit - Number of items per page
 * @param {number} options.offset - Offset for pagination
 * @param {string} options.session - Filter by parliamentary session
 * @returns {Promise<Object>} - List of votes with pagination info
 */
export async function getVotes({ limit = 20, offset = 0, session = null } = {}) {
  const params = {
    limit,
    offset,
    session,
  };
  
  return fetchFromAPI('/votes/', params);
}

/**
 * Get details for a specific vote
 * @param {string} voteUrl - The URL path for the vote (e.g., "/votes/44-1/928/")
 * @returns {Promise<Object>} - Vote details
 */
export async function getVoteDetails(voteUrl) {
  return fetchFromAPI(voteUrl, {}, CACHE_TTL.DETAIL);
}

/**
 * Get a list of members with pagination
 * @param {Object} options - Options for the request
 * @param {number} options.limit - Number of items per page
 * @param {number} options.offset - Offset for pagination
 * @param {string} options.province - Filter by province
 * @param {string} options.party - Filter by party
 * @returns {Promise<Object>} - List of members with pagination info
 */
export async function getMembers({ limit = 20, offset = 0, province = null, party = null } = {}) {
  const params = {
    limit,
    offset,
    province,
    party,
  };
  
  return fetchFromAPI('/politicians/', params);
}

/**
 * Get details for a specific member
 * @param {string} memberUrl - The URL path for the member (e.g., "/politicians/justin-trudeau/")
 * @returns {Promise<Object>} - Member details
 */
export async function getMemberDetails(memberUrl) {
  return fetchFromAPI(memberUrl, {}, CACHE_TTL.DETAIL);
}

/**
 * Get votes for a specific member
 * @param {string} memberUrl - The URL path for the member
 * @param {number} limit - Number of items per page
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Object>} - Member's voting history
 */
export async function getMemberVotes(memberUrl, { limit = 20, offset = 0 } = {}) {
  const params = {
    limit,
    offset,
  };
  
  return fetchFromAPI(`${memberUrl}votes/`, params, CACHE_TTL.MEMBER_VOTES);
}

export default {
  getBills,
  getBillDetails,
  getVotes,
  getVoteDetails,
  getMembers,
  getMemberDetails,
  getMemberVotes,
};