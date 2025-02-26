import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

export const getVotes = async (params) => {
  const { data } = await api.get('/votes', { params });
  return data;
};

export const getBills = async (params) => {
  const { data } = await api.get('/bills', { params });
  return data;
};

export const getMembers = async (params) => {
  const { data } = await api.get('/members', { params });
  return data;
};

export const getMemberVotes = async (memberId, params) => {
  const { data } = await api.get(`/members/${memberId}/votes`, { params });
  return data;
};

export default api;