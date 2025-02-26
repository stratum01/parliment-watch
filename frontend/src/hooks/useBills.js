import { useState, useEffect } from 'react';
import { getBills } from '@lib/api';

export const useBills = (params = {}) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        setLoading(true);
        const data = await getBills(params);
        setBills(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [params]);

  return { bills, loading, error };
};