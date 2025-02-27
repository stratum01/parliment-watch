import React from 'react';

// Placeholder components until full implementation
const MemberProfile = ({ member }) => (
  <div className="p-4 border rounded bg-white">
    <h2 className="text-xl font-semibold mb-4">Member Profile</h2>
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
      <div>
        <h3 className="font-medium">{member?.name || 'MP Name'}</h3>
        <p className="text-gray-600">{member?.constituency || 'Constituency'}</p>
      </div>
    </div>
  </div>
);

const MemberSearch = ({ onMemberSelect }) => (
  <div className="space-y-4">
    <div className="p-4 border rounded bg-white">
      <h2 className="text-xl font-semibold mb-4">Search Members</h2>
      <input 
        type="text" 
        className="w-full p-2 border rounded" 
        placeholder="Search for MPs..." 
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {[1, 2, 3, 4].map(i => (
          <div 
            key={i}
            className="p-4 border rounded cursor-pointer hover:bg-gray-50"
            onClick={() => onMemberSelect({ id: `m${i}`, name: `MP ${i}`, constituency: 'Sample Constituency' })}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div>
                <h3 className="font-medium">MP Name {i}</h3>
                <p className="text-sm text-gray-600">Constituency {i}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const VotingHistory = ({ memberId }) => (
  <div className="p-4 border rounded bg-white">
    <h2 className="text-xl font-semibold mb-4">Voting History</h2>
    <p className="text-gray-600 mb-4">Member ID: {memberId || 'Unknown'}</p>
    <div className="space-y-2">
      {[1, 2, 3].map(i => (
        <div key={i} className="p-3 border rounded hover:bg-gray-50">
          <div className="flex justify-between">
            <span className="font-medium">Bill C-{i}</span>
            <span className={`px-2 py-0.5 text-xs rounded ${i % 2 === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {i % 2 === 0 ? 'Yea' : 'Nay'}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Sample vote description {i}</p>
        </div>
      ))}
    </div>
  </div>
);

export { MemberProfile, MemberSearch, VotingHistory };