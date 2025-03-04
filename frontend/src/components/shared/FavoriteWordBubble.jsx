import React from 'react';

/**
 * Component for displaying MP's favorite word in a speech bubble
 */
const FavoriteWordBubble = ({ favoriteWord, partyColor }) => {
  // Map party color class to actual hex color
  const getColorFromParty = (partyClass) => {
    if (!partyClass) return '#6b7280'; // Gray default
    
    if (partyClass.includes('blue')) return '#1d4ed8'; // Conservative
    if (partyClass.includes('red')) return '#dc2626'; // Liberal
    if (partyClass.includes('orange')) return '#ea580c'; // NDP
    if (partyClass.includes('sky')) return '#0ea5e9'; // Bloc
    if (partyClass.includes('green')) return '#16a34a'; // Green
    
    return '#6b7280'; // Gray default
  };
  
  // Bubble positioning and styling with inline styles for reliability
  return (
    <div style={{
      position: 'absolute',
      top: '15px',
      left: '-110px',
      zIndex: 10
    }}>
      <div style={{ position: 'relative', maxWidth: '120px' }}>
        <div style={{
          backgroundColor: getColorFromParty(partyColor),
          color: 'white',
          borderRadius: '0.5rem',
          padding: '0.5rem 0.75rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
          <span>"{favoriteWord}"</span>
        </div>
        <div style={{
          position: 'absolute',
          top: '50%',
          right: '-6px',
          transform: 'translateY(-50%) rotate(45deg)',
          width: '12px',
          height: '12px',
          backgroundColor: getColorFromParty(partyColor)
        }}></div>
      </div>
    </div>
  );
};

export default FavoriteWordBubble;