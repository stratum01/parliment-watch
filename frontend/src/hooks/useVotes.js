import { useState, useEffect } from 'react';
import { getVotes } from '@lib/api';

export const useVotes = (params = {}) => {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        setLoading(true);
        const data = await getVotes(params);
        setVotes(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVotes();
  }, [params]);

  return { votes, loading, error };
};