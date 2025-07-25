import React from 'react';

interface Stream {
  id: number;
  username: string;
  viewers: number;
  avatar: string;
  featured?: boolean;
}

const StreamCard: React.FC<{ stream: Stream }> = ({ stream }) => {
  return (
    <a
      href={`/live/${stream.username}`}
      className="relative block bg-gray-800 rounded-lg p-2 cursor-pointer hover:shadow-lg"
    >
      <img src={stream.avatar} alt={stream.username} className="rounded" />
      <div className="absolute top-2 left-2 bg-red-500 text-xs px-1 rounded">
        {stream.viewers} watching
      </div>
      {stream.featured && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-xs px-1 rounded">
          Featured
        </div>
      )}
      <button className="absolute bottom-2 right-2 bg-pink-500 text-white px-2 py-1 rounded text-xs">
        Join
      </button>
    </a>
  );
};

export default StreamCard;
