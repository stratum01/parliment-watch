import { useState, useEffect } from 'react';
import { getMembers, getMemberVotes } from '@lib/api';

export const useMembers = (params = {}) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const data = await getMembers(params);
        setMembers(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [params]);

  return { members, loading, error };
};

export const useMemberVotes = (memberId, params = {}) => {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        setLoading(true);
        const data = await getMemberVotes(memberId, params);
        setVotes(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (memberId) {
      fetchVotes();
    }
  }, [memberId, params]);

  return { votes, loading, error };
};