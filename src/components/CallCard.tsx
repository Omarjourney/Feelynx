import React from 'react';
import { Creator } from '../types';

interface Props {
  creator: Pick<Creator, 'id' | 'username' | 'avatar' | 'rate'>;
  onStart: () => void;
}

const CallCard: React.FC<Props> = ({ creator, onStart }) => (
  <div className="bg-gray-800 p-2 rounded-lg text-center">
    <img src={creator.avatar} alt={creator.username} className="rounded mx-auto" />
    <div className="mt-2">@{creator.username}</div>
    <div className="text-sm text-gray-400">${creator.rate}/min</div>
    <button
      className="mt-2 w-full bg-pink-500 text-white py-1 rounded text-sm"
      onClick={onStart}
    >
      Call
    </button>
  </div>
);

export default CallCard;
