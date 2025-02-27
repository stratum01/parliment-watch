import React from 'react';
import { Search, Filter, Calendar } from 'lucide-react';

const SearchControls = ({ 
  searchValue = '', 
  onSearchChange = () => {}, 
  onFilterClick = () => {}, 
  onDateChange = () => {},
  placeholder = 'Search...'
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-2/3">
        <div className="relative rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            placeholder={placeholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex space-x-2 w-full md:w-1/3 justify-start md:justify-end">
        <button 
          onClick={onFilterClick}
          className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Filter className="h-4 w-4 mr-2" /> 
          Filter
        </button>
        
        <button 
          onClick={() => onDateChange({ from: null, to: null })}
          className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Calendar className="h-4 w-4 mr-2" /> 
          Date
        </button>
      </div>
    </div>
  );
};

export default SearchControls;