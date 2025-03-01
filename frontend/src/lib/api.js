import axios from 'axios';

// Create an API client with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log and handle errors
    console.error('API Error:', error.response?.data || error.message);
    
    // Rethrow error for component-level handling
    return Promise.reject(error);
  }
);

// Bills API
export const billsApi = {
  // Get list of bills with optional filtering
  getAll: async (params = {}) => {
    const response = await apiClient.get('/bills', { params });
    return response.data;
  },
  
  // Get details for a specific bill
  getById: async (session, billNumber) => {
    const response = await apiClient.get(`/bills/${session}/${billNumber}`);
    return response.data;
  }
};

// Votes API
export const votesApi = {
  // Get list of votes with optional filtering
  getAll: async (params = {}) => {
    const response = await apiClient.get('/votes', { params });
    return response.data;
  },
  
  // Get details for a specific vote
  getById: async (session, voteNumber) => {
    const response = await apiClient.get(`/votes/${session}/${voteNumber}`);
    return response.data;
  }
};

// Members API
export const membersApi = {
  // Get list of members with optional filtering
  getAll: async (params = {}) => {
    const response = await apiClient.get('/members', { params });
    return response.data;
  },
  
  // Get details for a specific member
  getById: async (memberName) => {
    const response = await apiClient.get(`/members/${memberName}`);
    return response.data;
  },
  
  // Get voting history for a specific member
  getVotes: async (memberName, params = {}) => {
    const response = await apiClient.get(`/members/${memberName}/votes`, { params });
    return response.data;
  },
  
  // Search for members by name or constituency
  search: async (query) => {
    const response = await apiClient.get('/members', { params: { search: query } });
    return response.data;
  }
};

// Export as a combined object
export default {
  bills: billsApi,
  votes: votesApi,
  members: membersApi
};