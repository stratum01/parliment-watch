import React from 'react';

const MemberProfile = ({ member }) => {
  if (!member) return null;
  
  // Extract all the needed data
  const { 
    name, 
    party, 
    constituency, 
    province, 
    email, 
    phone, 
    photo_url, 
    roles, 
    office,
    favorite_word,
    data // Raw data from the API
  } = member;

  // Extract additional fields from raw data if available
  const rawData = data || {};
  const otherInfo = rawData.other_info || {};
  const related = rawData.related || {};
  const constituency_offices = otherInfo.constituency_offices || [];
  const twitter = otherInfo.twitter || rawData.twitter;
  const wikipedia_id = otherInfo.wikipedia_id || rawData.wikipedia_id;
  const websites = [];
  
  // Construct official URL
  const official_url = rawData.url 
    ? `https://openparliament.ca${rawData.url}` 
    : null;
  
  // Add websites
  if (official_url) websites.push({ name: 'Parliament Profile', url: official_url });
  if (wikipedia_id) websites.push({ name: 'Wikipedia', url: `https://en.wikipedia.org/wiki/${wikipedia_id}` });

  // Determine party color
  const getPartyColor = () => {
    const partyName = typeof party === 'string' ? party : party?.short_name?.en || '';
    
    switch (partyName.toLowerCase()) {
      case 'liberal':
        return 'bg-red-500';
      case 'conservative':
        return 'bg-blue-500';
      case 'ndp':
        return 'bg-orange-500';
      case 'bloc québécois':
      case 'bloc quebecois':
        return 'bg-sky-500';
      case 'green':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Format party name for display
  const getPartyName = () => {
    if (!party) return '';
    if (typeof party === 'string') {
      return party;
    }
    if (party.short_name && party.short_name.en) {
      return party.short_name.en;
    }
    return '';
  };

  // Format constituency for display
  const getConstituency = () => {
    if (!constituency) return '';
    if (typeof constituency === 'string') {
      return constituency;
    }
    if (constituency.name && constituency.name.en) {
      return constituency.name.en;
    }
    return '';
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
      <div className="md:flex">
      {/* Profile Photo with Favorite Word Bubble and Tags */}
      <div className="md:w-1/3 p-4 flex justify-center relative">
        {/* Special Tags */}
        {data?.other_info?.wordcloud_id && (
          <div className="absolute -top-3 -left-2">
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
              {data.other_info.wordcloud_id}
            </span>
          </div>
        )}

        <div className="w-32 h-32 md:w-40 md:h-40 relative rounded-lg overflow-hidden">
          <img
            src={photo_url || "/api/placeholder/400/400"}
            alt={name}
            className="object-cover w-full h-full"
          />
        </div>
        {/* Favorite Word Speech Bubble */}
        {data?.other_info?.favourite_word || favorite_word ? (
          <div className="absolute top-3 left-0 transform -translate-x-3/4">
            <div className="relative z-10">
              <div className={`${getPartyColor()} text-white rounded-lg px-3 py-2 shadow-lg text-sm font-medium`}>
                <span>"{typeof data?.other_info?.favourite_word === 'string' 
                  ? data.other_info.favourite_word 
                  : Array.isArray(data?.other_info?.favourite_word) 
                    ? data.other_info.favourite_word[0] 
                    : favorite_word}"</span>
              </div>
              <div className={`absolute top-1/2 -right-1.5 transform -translate-y-1/2 rotate-45 w-3 h-3 ${getPartyColor()}`}></div>
            </div>
          </div>
        ) : null}
      </div>

        {/* Profile Details */}
        <div className="md:w-2/3 p-4">
          <div className="flex flex-col mb-4">
            <h2 className="text-2xl font-bold">{name}</h2>
  
            {/* Party Information */}
            <div className="flex items-center mt-1">
              <div className={`h-3 w-3 rounded-full ${getPartyColor()} mr-2`}></div>
              <span className="text-gray-700">
                {party ? `${party} MP` : 'MP'}
              </span>
            </div>
  
            {/* Constituency Information */}
            <div className="mt-1 text-gray-600">
              {constituency}
              {province && constituency ? `, ${province}` : province || ''}
            </div>
  
            {/* Roles Information */}
            {roles && roles.length > 0 && (
              <div className="mt-3">
                <h3 className="text-sm font-medium text-gray-700">Roles:</h3>
                <ul className="mt-1 text-sm text-gray-600">
                  {roles.map((role, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{role}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Contact Information:</h3>
            <div className="grid grid-cols-1 gap-2 text-sm">
              {email && (
                <div>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href={`mailto:${email}`} className="text-blue-600 hover:underline">{email}</a>
                  </div>
                </div>
              )}
              
              {phone && (
                <div>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{phone}</span>
                  </div>
                </div>
              )}
              
              {/* Social Media */}
              {twitter && typeof twitter === 'string' && (
                <div>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.1 10.1 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                    <a 
                      href={`https://twitter.com/${twitter.startsWith('@') ? twitter.substring(1) : twitter}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline"
                    >
                      {twitter}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Constituency Offices */}
          {constituency_offices && constituency_offices.length > 0 && (
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Constituency Office:</h3>
              <div className="space-y-2">
                {constituency_offices.map((office, index) => (
                  <div key={index} className="flex items-start">
                    <svg className="h-4 w-4 mr-2 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <div className="text-xs text-gray-600">{office}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Main Constituency Office */}
          {office && (office.address || office.phone) && (
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Parliament Office:</h3>
              <div className="flex items-start">
                <svg className="h-4 w-4 mr-2 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <div>
                  {office.address && (
                    <p className="text-xs text-gray-600">{office.address}</p>
                  )}
                  {office.phone && (
                    <p className="text-xs text-gray-600 mt-1">Phone: {office.phone}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Websites */}
          {websites.length > 0 && (
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">More Information:</h3>
              <div className="flex flex-wrap gap-2">
                {websites.map((site, index) => (
                  <a 
                    key={index}
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 flex items-center"
                  >
                    <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {site.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;