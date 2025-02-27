import React from 'react';

const MemberProfile = ({ member }) => {
  if (!member) return null;
  
  const { name, party, constituency, province, email, phone, photo_url, roles, office } = member;

  // Determine party color
  const getPartyColor = () => {
    switch (party) {
      case 'Liberal':
        return 'bg-red-500';
      case 'Conservative':
        return 'bg-blue-500';
      case 'NDP':
        return 'bg-orange-500';
      case 'Bloc Québécois':
        return 'bg-sky-500';
      case 'Green':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
      <div className="md:flex">
        {/* Profile Photo */}
        <div className="md:w-1/3 p-4 flex justify-center">
          <div className="w-32 h-32 md:w-40 md:h-40 relative rounded-lg overflow-hidden">
            <img
              src={photo_url || "/api/placeholder/400/400"}
              alt={name}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        
        {/* Profile Details */}
        <div className="md:w-2/3 p-4">
          <div className="flex flex-col mb-4">
            <h2 className="text-2xl font-bold">{name}</h2>
            <div className="flex items-center mt-1">
              <div className={`h-3 w-3 rounded-full ${getPartyColor()} mr-2`}></div>
              <span className="text-gray-700">{party} MP</span>
            </div>
            <div className="mt-1 text-gray-600">{constituency}, {province}</div>
            
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${email}`} className="text-blue-600 hover:underline">{email}</a>
                </div>
                <div className="flex items-center mt-2">
                  <svg className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{phone}</span>
                </div>
              </div>
              
              {office && (
                <div>
                  <div className="flex items-start">
                    <svg className="h-4 w-4 mr-2 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <div className="font-medium">Constituency Office:</div>
                      <p className="text-gray-600 text-xs mt-1">
                        {office.address}<br />
                        Phone: {office.phone}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;