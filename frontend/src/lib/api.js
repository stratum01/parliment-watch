import axios from 'axios';
import { mockVotes, mockBills, mockMembers, mockMemberVotes } from '../../backend/src/mockData';

// Configure axios instance
const apiClient = axios.create({
  baseURL: '/api',
  timeout: 5000,
});

// Use mock data in development if the environment variable is set
const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Helper to determine if we should use mock data
const shouldUseMockData = () => {
  return useMockData || process.env.NODE_ENV === 'development';
};

// Votes API
export const getVotes = async (params = {}) => {
  if (shouldUseMockData()) {
    console.log('Using mock votes data');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Apply filters if needed
    let filteredVotes = [...mockVotes];
    
    if (params.limit) {
      filteredVotes = filteredVotes.slice(0, params.limit);
    }
    
    if (params.dateFrom) {
      const dateFrom = new Date(params.dateFrom);
      filteredVotes = filteredVotes.filter(vote => new Date(vote.date) >= dateFrom);
    }
    
    if (params.dateTo) {
      const dateTo = new Date(params.dateTo);
      filteredVotes = filteredVotes.filter(vote => new Date(vote.date) <= dateTo);
    }
    
    return filteredVotes;
  }
  
  try {
    const response = await apiClient.get('/votes', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching votes:', error);
    throw error;
  }
};

// Bills API
export const getBills = async (params = {}) => {
  if (shouldUseMockData()) {
    console.log('Using mock bills data');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Apply filters if needed
    let filteredBills = [...mockBills];
    
    if (params.limit) {
      filteredBills = filteredBills.slice(0, params.limit);
    }
    
    if (params.status) {
      filteredBills = filteredBills.filter(bill => 
        bill.status.toLowerCase() === params.status.toLowerCase()
      );
    }
    
    return filteredBills;
  }
  
  try {
    const response = await apiClient.get('/bills', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching bills:', error);
    throw error;
  }
};

// Get specific bill by ID
export const getBillById = async (id) => {
  if (shouldUseMockData()) {
    console.log('Using mock bill data');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const bill = mockBills.find(bill => bill.id === id);
    
    if (!bill) {
      throw new Error('Bill not found');
    }
    
    return bill;
  }
  
  try {
    const response = await apiClient.get(`/bills/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching bill ${id}:`, error);
    throw error;
  }
};

// Members API
export const getMembers = async (params = {}) => {
  if (shouldUseMockData()) {
    console.log('Using mock members data');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Apply filters if needed
    let filteredMembers = [...mockMembers];
    
    if (params.party) {
      filteredMembers = filteredMembers.filter(member => 
        member.party.toLowerCase() === params.party.toLowerCase()
      );
    }
    
    if (params.province) {
      filteredMembers = filteredMembers.filter(member => 
        member.province.toLowerCase() === params.province.toLowerCase()
      );
    }
    
    return filteredMembers;
  }
  
  try {
    const response = await apiClient.get('/members', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching members:', error);
    throw error;
  }
};

// Get member by ID
export const getMemberById = async (id) => {
  if (shouldUseMockData()) {
    console.log('Using mock member data');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const member = mockMembers.find(member => member.id === id);
    
    if (!member) {
      throw new Error('Member not found');
    }
    
    return member;
  }
  
  try {
    const response = await apiClient.get(`/members/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching member ${id}:`, error);
    throw error;
  }
};

// Get member voting history
export const getMemberVotes = async (memberId) => {
  if (shouldUseMockData()) {
    console.log('Using mock member votes data');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const votes = mockMemberVotes[memberId];
    
    if (!votes) {
      throw new Error('Member votes not found');
    }
    
    return votes;
  }
  
  try {
    const response = await apiClient.get(`/members/${memberId}/votes`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching votes for member ${memberId}:`, error);
    throw error;
  }
};