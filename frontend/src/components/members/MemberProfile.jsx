import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const MemberProfile = ({ member }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Photo */}
          <div className="w-48 flex-shrink-0">
            <div className="aspect-square relative rounded-lg overflow-hidden">
              <img
                src={member?.photo_url || "/api/placeholder/400/400"}
                alt={member?.name || "Member photo"}
                className="object-cover"
              />
            </div>
          </div>
          
          {/* Details */}
          <div className="flex-grow">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{member?.name}</h2>
              <div className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${
                  member?.party === 'Liberal' ? 'bg-red-500' :
                  member?.party === 'Conservative' ? 'bg-blue-500' :
                  member?.party === 'NDP' ? 'bg-orange-500' :
                  member?.party === 'Bloc Québécois' ? 'bg-sky-500' :
                  'bg-gray-500'
                }`}></div>
                <p className="text-gray-600">{member?.party} MP</p>
              </div>
              <p className="text-gray-600">{member?.constituency} ({member?.province})</p>
            </div>
            
            <div className="space-y-2 pt-4 border-t mt-4">
              <div>
                <span className="text-gray-600">Email:</span>
                <a href={`mailto:${member?.email}`} className="text-blue-600 ml-2 hover:underline break-all">
                  {member?.email}
                </a>
              </div>
              <div>
                <span className="text-gray-600">Phone:</span>
                <span className="ml-2">{member?.phone}</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-600">Constituency Office:</span>
                <p className="text-sm">
                  {member?.office?.address}<br />
                  Phone: {member?.office?.phone}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};