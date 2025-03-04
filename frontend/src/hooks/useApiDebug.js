import React, { useState, useEffect } from 'react';

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

// Add a simple debug component to add to your app
export const ApiDebugPanel = ({ onClose }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const runTests = async () => {
    setLoading(true);
    const connectionResults = await checkApiConnection();
    setResults(connectionResults);
    setLoading(false);
  };
  
  useEffect(() => {
    runTests();
  }, []);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">API Connection Debugger</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : results ? (
          <div className="space-y-4">
            <div className={`p-4 rounded-md ${results.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <p className="font-medium">
                {results.success ? 'API Connection Successful' : 'API Connection Failed'}
              </p>
              {results.error && <p className="mt-1">{results.error}</p>}
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Endpoint Status:</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className={`w-4 h-4 rounded-full mr-2 ${results.endpoints.members ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span>/members endpoint</span>
                </li>
                <li className="flex items-center">
                  <span className={`w-4 h-4 rounded-full mr-2 ${results.endpoints.bills ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span>/bills endpoint</span>
                </li>
                <li className="flex items-center">
                  <span className={`w-4 h-4 rounded-full mr-2 ${results.endpoints.votes ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span>/votes endpoint</span>
                </li>
              </ul>
            </div>
            
            {results.membersData && (
              <div>
                <h3 className="font-medium mb-2">Members Data:</h3>
                <p>Count: {results.membersData.count}</p>
                <p>Structure: {results.membersData.structure.join(', ')}</p>
              </div>
            )}
            
            <div className="pt-4 border-t">
              <button
                onClick={runTests}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Run Tests Again
              </button>
            </div>
          </div>
        ) : (
          <p>No results available.</p>
        )}
      </div>
    </div>
  );
};

export default {
  checkApiConnection,
  validateMemberData,
  ApiDebugPanel
};