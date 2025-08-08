import React, { useState } from 'react';
import GroupCard from '../components/GroupCard';

const mockGroups = [
  {
    id: 1,
    name: 'Fans Club',
    members: 1200,
    thumbnail: 'https://placekitten.com/230/200',
    live: true,
    description: 'Exclusive updates and streams',
  },
  {
    id: 2,
    name: 'VIP Room',
    members: 300,
    thumbnail: 'https://placekitten.com/231/200',
    live: false,
    description: 'Behind the scenes content',
  },
];

const Groups: React.FC = () => {
  const [groups] = useState(mockGroups);
  return (
    <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {groups.map(g => (
        <GroupCard key={g.id} group={g} />
      ))}
    </div>
  );
};

export default Groups;
