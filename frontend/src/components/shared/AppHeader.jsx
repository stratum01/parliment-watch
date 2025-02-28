// src/components/shared/AppHeader.jsx

import React from 'react';
import APIStatus from './APIStatus';

const AppHeader = () => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="h-8 w-auto"
                src="/api/placeholder/32/32"
                alt="Parliament Watch"
              />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900">Parliament Watch</h1>
              <p className="text-sm text-gray-500">
                Tracking Canadian Parliamentary Activity
              </p>
            </div>
          </div>
          
          <div className="hidden md:block">
            <APIStatus />
          </div>
          
          <div className="ml-6 flex items-center">
            <a
              href="https://openparliament.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Data from OpenParliament.ca
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;