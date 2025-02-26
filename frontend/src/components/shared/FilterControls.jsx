import React, { useState } from 'react';
import { Filter, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { 
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

export const FilterButton = ({ onClick, children }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
  >
    <Filter className="h-4 w-4" />
    {children}
  </button>
);

export const DateRangePicker = ({ onDateChange }) => {
  const [date, setDate] = useState(null);

  const handleSelect = (newDate) => {
    setDate(newDate);
    onDateChange(newDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
          <Calendar className="h-4 w-4" />
          {date ? format(date, 'PPP') : 'Pick a date'}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

// Combined search controls component
export const SearchControls = ({ 
  searchValue, 
  onSearchChange, 
  onFilterClick, 
  onDateChange,
  placeholder 
}) => {
  return (
    <div className="flex gap-4 items-center mb-6">
      <SearchBar 
        value={searchValue} 
        onChange={onSearchChange}
        placeholder={placeholder}
      />
      <FilterButton onClick={onFilterClick}>
        Filter
      </FilterButton>
      <DateRangePicker onDateChange={onDateChange} />
    </div>
  );
};

export default SearchControls;