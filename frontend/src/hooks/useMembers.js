import { useState, useEffect } from 'react';
import { getMembers, getMemberById, getMemberVotes } from '../lib/api';

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

export const useMember = (id) => {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchMember = async () => {
      try {
        setLoading(true);
        const data = await getMemberById(id);
        setMember(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  return { member, loading, error };
};

export const useMemberVotes = (memberId) => {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!memberId) {
      setLoading(false);
      return;
    }

    const fetchVotes = async () => {
      try {
        setLoading(true);
        const data = await getMemberVotes(memberId);
        setVotes(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVotes();
  }, [memberId]);

  return { votes, loading, error };
};