import { useState, useEffect } from 'react';

// Mock members data
const mockMembers = [
  {
    id: "m1",
    name: "Marco Mendicino",
    party: "Liberal",
    constituency: "Eglinton—Lawrence",
    province: "ON",
    email: "marco.mendicino@parl.gc.ca",
    phone: "613-992-6361",
    photo_url: "/api/placeholder/400/400",
    roles: ["Minister of Public Safety"],
    office: {
      address: "511 Lawrence Avenue West, Toronto, Ontario, M6A 1A3",
      phone: "416-781-5583"
    }
  },
  {
    id: "m2",
    name: "Pierre Poilievre",
    party: "Conservative",
    constituency: "Carleton",
    province: "ON",
    email: "pierre.poilievre@parl.gc.ca",
    phone: "613-992-2772",
    photo_url: "/api/placeholder/400/400",
    roles: ["Leader of the Official Opposition"],
    office: {
      address: "1139 Mill Street, Manotick, Ontario, K4M 1A5",
      phone: "613-692-3331"
    }
  },
  {
    id: "m3",
    name: "Jagmeet Singh",
    party: "NDP",
    constituency: "Burnaby South",
    province: "BC",
    email: "jagmeet.singh@parl.gc.ca",
    phone: "613-995-7224",
    photo_url: "/api/placeholder/400/400",
    roles: ["Leader of the New Democratic Party"],
    office: {
      address: "4940 Kingsway, Burnaby, British Columbia, V5H 2E2",
      phone: "604-291-8863"
    }
  },
  {
    id: "m4",
    name: "Elizabeth May",
    party: "Green",
    constituency: "Saanich—Gulf Islands",
    province: "BC",
    email: "elizabeth.may@parl.gc.ca",
    phone: "613-996-1119",
    photo_url: "/api/placeholder/400/400",
    roles: ["Parliamentary Leader of the Green Party"],
    office: {
      address: "9711 Fourth Street, Sidney, British Columbia, V8L 2Y8",
      phone: "250-657-2000"
    }
  },
  {
    id: "m5",
    name: "Yves-François Blanchet",
    party: "Bloc Québécois",
    constituency: "Beloeil—Chambly",
    province: "QC",
    email: "yves-francois.blanchet@parl.gc.ca",
    phone: "613-992-2640",
    photo_url: "/api/placeholder/400/400",
    roles: ["Leader of the Bloc Québécois"],
    office: {
      address: "1997 Rue Drummond, Beloeil, Quebec, J3G 0K9",
      phone: "450-658-0088"
    }
  },
  {
    id: "m6",
    name: "Chrystia Freeland",
    party: "Liberal",
    constituency: "University—Rosedale",
    province: "ON",
    email: "chrystia.freeland@parl.gc.ca",
    phone: "613-992-5234",
    photo_url: "/api/placeholder/400/400",
    roles: ["Deputy Prime Minister", "Minister of Finance"],
    office: {
      address: "344 Bloor Street West, Toronto, Ontario, M5S 3A7",
      phone: "416-928-1451"
    }
  }
];

export const useMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMembers(mockMembers);
      setLoading(false);
    }, 500);
  }, []);

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

    // Simulate API call
    setTimeout(() => {
      const foundMember = mockMembers.find(m => m.id === id);
      if (foundMember) {
        setMember(foundMember);
      } else {
        setError('Member not found');
      }
      setLoading(false);
    }, 500);
  }, [id]);

  return { member, loading, error };
};