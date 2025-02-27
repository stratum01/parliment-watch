import React from 'react';

const MemberSearch = ({ onMemberSelect }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const { members, loading } = useMembers();

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.constituency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mb-6">
      <SearchControls
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search MPs by name or constituency..."
      />
      {loading ? (
        <div>Loading members...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {filteredMembers.map(member => (
            <div
              key={member.id}
              className="p-4 border rounded-lg hover:border-blue-200 cursor-pointer"
              onClick={() => onMemberSelect(member)}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={member.photo_url || "/api/placeholder/100/100"}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.constituency}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemberSearch;