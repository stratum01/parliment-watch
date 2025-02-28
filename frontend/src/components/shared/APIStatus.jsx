import React, { useState, useEffect } from 'react';

/**
 * Component to display the status of the API connection
 */
const APIStatus = () => {
  const [status, setStatus] = useState('checking'); // 'checking', 'online', 'offline'
  const [lastChecked, setLastChecked] = useState(null);

  const checkAPIStatus = async () => {
    try {
      setStatus('checking');
      
      // Try to fetch a minimal amount of data
      const response = await fetch('https://api.openparliament.ca/bills/?format=json&limit=1');
      
      if (response.ok) {
        setStatus('online');
      } else {
        setStatus('offline');
      }
    } catch (error) {
      console.error('API status check failed:', error);
      setStatus('offline');
    }
    
    setLastChecked(new Date());
  };

  // Check status on mount and every 5 minutes
  useEffect(() => {
    checkAPIStatus();
    
    const intervalId = setInterval(checkAPIStatus, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Format the last checked time
  const formattedTime = lastChecked
    ? lastChecked.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className="flex items-center space-x-2 text-sm">
      <div className="flex items-center">
        <span className="mr-2">API:</span>
        
        {status === 'checking' && (
          <div className="flex items-center">
            <div className="animate-pulse h-2.5 w-2.5 rounded-full bg-yellow-500 mr-1"></div>
            <span className="text-yellow-600">Checking...</span>
          </div>
        )}
        
        {status === 'online' && (
          <div className="flex items-center">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-1"></div>
            <span className="text-green-600">Online</span>
          </div>
        )}
        
        {status === 'offline' && (
          <div className="flex items-center">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-1"></div>
            <span className="text-red-600">Offline</span>
          </div>
        )}
      </div>
      
      {lastChecked && (
        <div className="text-gray-500 hidden sm:block">
          Last checked: {formattedTime}
        </div>
      )}
    </div>
  );
};

export default APIStatus;