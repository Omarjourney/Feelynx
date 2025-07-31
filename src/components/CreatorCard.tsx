import React from 'react';
import { Creator } from '../types';

const CreatorCard: React.FC<{ creator: Pick<Creator, 'id' | 'username' | 'avatar' | 'isLive' | 'rate'> }> = ({ creator }) => (
  <div className="relative bg-gray-800 rounded-lg p-2">
    <img src={creator.avatar} alt={creator.username} className="rounded" />
    {creator.isLive && (
      <div className="absolute top-2 right-2 bg-green-500 text-xs px-1 rounded">
        Live
      </div>
    )}
    <div className="mt-2 text-sm flex justify-between items-center">
      <span>@{creator.username}</span>
      <span className="text-xs text-gray-400">${creator.rate}/min</span>
    </div>
    <button className="mt-2 w-full bg-pink-500 text-white py-1 rounded text-sm">
      Call
    </button>
  </div>
);

export default CreatorCard;
