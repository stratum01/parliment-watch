// src/lib/api/errorHandler.js

/**
 * Custom error class for API errors
 */
export class APIError extends Error {
  constructor(message, status, endpoint, details = {}) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.endpoint = endpoint;
    this.details = details;
  }
}

/**
 * Formats a human-readable message based on an error
 * @param {Error} error - The error object
 * @returns {string} - Formatted error message
 */
export function formatErrorMessage(error) {
  if (error instanceof APIError) {
    let message = `API Error (${error.status}): ${error.message}`;
    
    if (error.endpoint) {
      message += ` [${error.endpoint}]`;
    }
    
    return message;
  } else if (error.message) {
    return `Error: ${error.message}`;
  } else {
    return 'An unknown error occurred';
  }
}

/**
 * Handles API errors and returns a standardized error message
 * @param {Error} error - The error object
 * @param {string} fallbackMessage - Fallback message to use
 * @returns {string} - User-friendly error message
 */
export function handleAPIError(error, fallbackMessage = 'Failed to load data. Please try again.') {
  console.error('API Error:', error);
  
  if (error instanceof APIError) {
    // Handle specific status codes
    switch (error.status) {
      case 401:
        return 'Authentication required. Please refresh the page and try again.';
      case 403:
        return 'You do not have permission to access this resource.';
      case 404:
        return 'The requested resource could not be found.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
      case 502:
      case 503:
      case 504:
        return 'The server encountered an error. Please try again later.';
      default:
        return `API Error: ${error.message}`;
    }
  } else if (error.name === 'AbortError') {
    return 'Request was cancelled. Please try again.';
  } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
    return 'Could not connect to the server. Please check your internet connection.';
  } else {
    return fallbackMessage;
  }
}

/**
 * Creates an APIError from a fetch response
 * @param {Response} response - Fetch response object
 * @param {string} endpoint - API endpoint that was requested
 * @returns {Promise<APIError>} - Promise that resolves to an APIError
 */
export async function createAPIError(response, endpoint) {
  let details = {};
  
  try {
    // Try to parse error details from response
    details = await response.json();
  } catch (e) {
    // If parsing fails, use text if available
    try {
      details = { message: await response.text() };
    } catch (e2) {
      // If that also fails, use a generic message
      details = { message: 'No error details available' };
    }
  }
  
  const message = details.message || `Request failed with status: ${response.status}`;
  
  return new APIError(message, response.status, endpoint, details);
}

export default {
  APIError,
  formatErrorMessage,
  handleAPIError,
  createAPIError
};