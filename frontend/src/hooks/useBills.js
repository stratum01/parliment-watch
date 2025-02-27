import { useState, useEffect } from 'react';

export const useBills = (params = {}) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        setLoading(true);
        
        // Mock data - directly included to avoid import issues
        const mockBills = [
          {
            id: "b1",
            number: "C-79",
            name: {
              en: "An Act for granting to His Majesty certain sums of money for the federal public administration",
              fr: "Loi portant octroi à Sa Majesté de crédits pour l'administration publique fédérale"
            },
            introduced_date: "2024-12-01",
            status: "Third Reading",
            sponsor: "Hon. Chrystia Freeland",
            last_event: "Passed third reading (2024-12-10)",
            progress: 90,
            session: "44-1"
          },
          {
            id: "b2",
            number: "C-45",
            name: {
              en: "Cannabis Regulation Amendment Act",
              fr: "Loi modifiant la réglementation du cannabis"
            },
            introduced_date: "2024-11-15",
            status: "Committee",
            sponsor: "Hon. Mark Holland",
            last_event: "Referred to committee (2024-12-01)",
            progress: 60,
            session: "44-1"
          },
          {
            id: "b3",
            number: "C-56",
            name: {
              en: "Affordable Housing and Public Transit Act",
              fr: "Loi sur le logement abordable et le transport en commun"
            },
            introduced_date: "2024-11-01",
            status: "Second Reading",
            sponsor: "Hon. Sean Fraser",
            last_event: "Debate at second reading (2024-11-20)",
            progress: 40,
            session: "44-1"
          },
          {
            id: "b4",
            number: "C-123",
            name: {
              en: "Economic Statement Implementation Act",
              fr: "Loi d'exécution de l'énoncé économique"
            },
            introduced_date: "2024-10-20",
            status: "Royal Assent",
            sponsor: "Hon. Chrystia Freeland",
            last_event: "Royal Assent received (2024-12-15)",
            progress: 100,
            session: "44-1"
          },
          {
            id: "b5",
            number: "C-32",
            name: {
              en: "Online Streaming Act",
              fr: "Loi sur la diffusion continue en ligne"
            },
            introduced_date: "2024-10-15",
            status: "First Reading",
            sponsor: "Hon. Pablo Rodriguez",
            last_event: "Introduction and first reading (2024-10-15)",
            progress: 20,
            session: "44-1"
          },
          {
            id: "b6",
            number: "C-18",
            name: {
              en: "Online News Act",
              fr: "Loi sur les nouvelles en ligne"
            },
            introduced_date: "2024-09-22",
            status: "Royal Assent",
            sponsor: "Hon. Pablo Rodriguez",
            last_event: "Royal Assent received (2024-11-07)",
            progress: 100,
            session: "44-1"
          }
        ];
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Apply filters if needed
        let filteredBills = [...mockBills];
        
        if (params.status) {
          filteredBills = filteredBills.filter(bill => 
            bill.status.toLowerCase() === params.status.toLowerCase()
          );
        }
        
        setBills(filteredBills);
        setError(null);
      } catch (err) {
        console.error('Error fetching bills:', err);
        setError('Failed to load bills data.');
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [params]);

  return { bills, loading, error };
};

export const useBillById = (id) => {
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchBill = async () => {
      try {
        setLoading(true);
        
        // Mock data - directly included to avoid import issues
        const mockBills = [
          {
            id: "b1",
            number: "C-79",
            name: {
              en: "An Act for granting to His Majesty certain sums of money for the federal public administration",
              fr: "Loi portant octroi à Sa Majesté de crédits pour l'administration publique fédérale"
            },
            introduced_date: "2024-12-01",
            status: "Third Reading",
            sponsor: "Hon. Chrystia Freeland",
            last_event: "Passed third reading (2024-12-10)",
            progress: 90,
            session: "44-1"
          },
          {
            id: "b2",
            number: "C-45",
            name: {
              en: "Cannabis Regulation Amendment Act",
              fr: "Loi modifiant la réglementation du cannabis"
            },
            introduced_date: "2024-11-15",
            status: "Committee",
            sponsor: "Hon. Mark Holland",
            last_event: "Referred to committee (2024-12-01)",
            progress: 60,
            session: "44-1"
          },
          // other bills...
        ];
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const bill = mockBills.find(bill => bill.id === id || bill.number === id);
        
        if (!bill) {
          throw new Error('Bill not found');
        }
        
        setBill(bill);
        setError(null);
      } catch (err) {
        console.error(`Error fetching bill ${id}:`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBill();
  }, [id]);

  return { bill, loading, error };
};