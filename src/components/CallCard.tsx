import React from 'react';

interface Creator {
  id: number;
  username: string;
  avatar: string;
  rate: number;
}

const CallCard: React.FC<{ creator: Creator }> = ({ creator }) => {
  const startCall = () => {
    alert(`Starting call with ${creator.username}`);
  };

  return (
    <div className="bg-gray-800 p-2 rounded-lg text-center">
      <img src={creator.avatar} alt={creator.username} className="rounded mx-auto" />
      <div className="mt-2">@{creator.username}</div>
      <div className="text-sm text-gray-400">${creator.rate}/min</div>
      <button
        className="mt-2 w-full bg-pink-500 text-white py-1 rounded text-sm"
        onClick={startCall}
      >
        Call
      </button>
    </div>
  );
};

export default CallCard;
