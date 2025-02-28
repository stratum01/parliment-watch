import cache from '../cache';
import { createAPIError, APIError } from './errorHandler';

// We're using a CORS proxy to avoid CORS issues
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const API_BASE_URL = 'https://api.openparliament.ca';

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
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
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
    // Add proper headers including User-Agent with contact email
    const headers = {
      'Accept': 'application/json',
      'User-Agent': 'Parliament-Watch/1.0 (jrfchambers@gmail.com)',
      'API-Version': 'v1',
    };
    
    // Use CORS proxy to avoid CORS issues
    const response = await fetch(`${CORS_PROXY}${url.toString()}`, { headers });
    
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