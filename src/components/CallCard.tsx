import React from 'react';
import { Creator } from '../types';

interface Props {
  creator: Pick<Creator, 'id' | 'username' | 'avatar' | 'rate'>;
  onStart: () => void;
}

const CallCard: React.FC<Props> = ({ creator, onStart }) => {
  const { username, avatar, rate } = creator;
  return (
    <div className="bg-gray-800 rounded p-2 flex items-center space-x-2">
      <img src={avatar} alt={username} className="w-12 h-12 rounded-full object-cover" />
      <div className="flex-1">
        <div className="font-semibold">@{username}</div>
        <div className="text-xs text-gray-400">{rate} coins/min</div>
      </div>
      <button className="bg-pink-500 text-white px-2 py-1 rounded" onClick={onStart}>
        Call
      </button>
    </div>
  );
};

export default CallCard;
