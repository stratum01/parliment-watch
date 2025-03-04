import React, { useState, useEffect } from 'react';
import { checkApiConnection } from './useApiDebug';

/**
 * Debug panel component to test API connections
 */
const ApiDebugPanel = ({ onClose }) => {
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

export default ApiDebugPanel;