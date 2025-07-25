import React from 'react';

interface Group {
  id: number;
  name: string;
  members: number;
  thumbnail: string;
  live: boolean;
}

const GroupCard: React.FC<{ group: Group }> = ({ group }) => (
  <a href={`/groups/${group.id}`} className="relative bg-gray-800 rounded-lg p-2 block hover:shadow-lg">
    <img src={group.thumbnail} alt={group.name} className="rounded" />
    {group.live && (
      <div className="absolute top-2 left-2 bg-red-500 text-xs px-1 rounded">
        Live
      </div>
    )}
    <div className="mt-2 text-sm font-semibold">{group.name}</div>
    <div className="text-xs text-gray-400">{group.members} members</div>
    <button className="mt-2 w-full bg-pink-500 text-white py-1 rounded text-sm">Open</button>
  </a>
);

export default GroupCard;
