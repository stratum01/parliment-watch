/**
 * Extract page number from a URL
 * @param {string} url - URL with pagination parameters
 * @param {string} paramName - Parameter name (default: 'offset')
 * @returns {number} - Page number extracted from URL
 */
export function extractPageFromUrl(url, paramName = 'offset') {
  if (!url) return 0;
  
  try {
    const urlObj = new URL(url);
    const offset = parseInt(urlObj.searchParams.get(paramName) || '0', 10);
    const limit = parseInt(urlObj.searchParams.get('limit') || '20', 10);
    
    return Math.floor(offset / limit) + 1;
  } catch (error) {
    console.error('Error parsing pagination URL:', error);
    return 0;
  }
}

/**
 * Parse pagination data from OpenParliament API
 * @param {Object} paginationData - Pagination data from API
 * @param {number} limit - Items per page
 * @returns {Object} - Structured pagination info
 */
export function parsePagination(paginationData, limit = 20) {
  if (!paginationData) return {};
  
  const offset = paginationData.offset || 0;
  const hasNext = !!paginationData.next_url;
  const hasPrevious = !!paginationData.previous_url;
  
  // Calculate current page (1-based)
  const currentPage = Math.floor(offset / limit) + 1;
  
  // Try to determine total pages
  let totalPages = currentPage;
  if (hasNext) {
    // If there's a next page, get the next page number from the URL
    const nextPage = extractPageFromUrl(paginationData.next_url);
    if (nextPage > 0) {
      totalPages = nextPage;
    } else {
      // If we can't determine from the URL, just add 1
      totalPages = currentPage + 1;
    }
  }
  
  return {
    offset,
    limit,
    hasNext,
    hasPrevious,
    nextUrl: paginationData.next_url,
    previousUrl: paginationData.previous_url,
    currentPage,
    totalPages,
  };