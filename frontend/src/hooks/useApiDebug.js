/**
 * Helper utility to debug API connections
 */

export const checkApiConnection = async () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'https://parliament-watch-api.fly.dev/api';
  
  console.log('Checking API connection to:', apiUrl);
  
  try {
    // Test members endpoint
    console.log('Testing /members endpoint...');
    const membersResponse = await fetch(`${apiUrl}/members`);
    
    if (!membersResponse.ok) {
      console.error(`Members API error: ${membersResponse.status}`);
      return {
        success: false,
        error: `Members API returned status ${membersResponse.status}`,
        endpoints: {
          members: false,
          bills: false,
          votes: false
        }
      };
    }
    
    const membersData = await membersResponse.json();
    console.log('Members API response structure:', Object.keys(membersData));
    console.log('Members count:', membersData.objects?.length || 'unknown');
    
    // Test bills endpoint
    console.log('Testing /bills endpoint...');
    let billsSuccess = false;
    try {
      const billsResponse = await fetch(`${apiUrl}/bills`);
      billsSuccess = billsResponse.ok;
      if (billsSuccess) {
        const billsData = await billsResponse.json();
        console.log('Bills API response structure:', Object.keys(billsData));
        console.log('Bills count:', billsData.objects?.length || 'unknown');
      } else {
        console.error(`Bills API error: ${billsResponse.status}`);
      }
    } catch (err) {
      console.error('Bills API exception:', err);
    }
    
    // Test votes endpoint
    console.log('Testing /votes endpoint...');
    let votesSuccess = false;
    try {
      const votesResponse = await fetch(`${apiUrl}/votes`);
      votesSuccess = votesResponse.ok;
      if (votesSuccess) {
        const votesData = await votesResponse.json();
        console.log('Votes API response structure:', Object.keys(votesData));
        console.log('Votes count:', votesData.objects?.length || 'unknown');
      } else {
        console.error(`Votes API error: ${votesResponse.status}`);
      }
    } catch (err) {
      console.error('Votes API exception:', err);
    }
    
    return {
      success: true,
      endpoints: {
        members: true,
        bills: billsSuccess,
        votes: votesSuccess
      },
      membersData: {
        count: membersData.objects?.length || 0,
        structure: Object.keys(membersData)
      }
    };
  } catch (err) {
    console.error('API connection test failed:', err);
    return {
      success: false,
      error: err.message,
      endpoints: {
        members: false,
        bills: false,
        votes: false
      }
    };
  }
};

// Sample utility to check data structure
export const validateMemberData = (member) => {
  const required = ['name'];
  const recommended = ['party', 'constituency', 'province', 'photo_url'];
  
  const validation = {
    valid: required.every(field => !!member[field]),
    missing: [],
    recommendations: []
  };
  
  // Check which required fields are missing
  required.forEach(field => {
    if (!member[field]) {
      validation.missing.push(field);
    }
  });
  
  // Check recommended fields
  recommended.forEach(field => {
    if (!member[field]) {
      validation.recommendations.push(`Missing recommended field: ${field}`);
    }
  });
  
  // Special checks for nested structures
  if (typeof member.party === 'object' && member.party !== null) {
    validation.recommendations.push(
      'Field "party" is an object but should be a string. Use party.short_name.en instead.'
    );
  }
  
  if (typeof member.constituency === 'object' && member.constituency !== null) {
    validation.recommendations.push(
      'Field "constituency" is an object but should be a string. Use constituency.name.en instead.'
    );
  }
  
  return validation;
};

export default {
  checkApiConnection,
  validateMemberData
};