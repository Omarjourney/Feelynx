import React, { useState } from 'react';

interface Stream {
  id: number;
  username: string;
  viewers: number;
  avatar: string;
  featured?: boolean;
  isNew?: boolean;
}

const StreamCard: React.FC<{ stream: Stream }> = ({ stream }) => {
  const [preview, setPreview] = useState(false);

  return (
    <a
      href={`/live/${stream.username}`}
      className="relative block bg-gray-800 rounded-lg p-2 cursor-pointer hover:shadow-lg overflow-hidden"
      onMouseEnter={() => setPreview(true)}
      onMouseLeave={() => setPreview(false)}
      onFocus={() => setPreview(true)}
      onBlur={() => setPreview(false)}
    >
      <img src={stream.avatar} alt={stream.username} className="rounded w-full" />
      {preview && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center text-xs">
          <video
            src="https://www.w3schools.com/html/mov_bbb.mp4"
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="absolute top-2 left-2 bg-red-500 text-xs px-1 rounded">
        {stream.viewers} watching
      </div>
      {stream.featured && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-xs px-1 rounded">Featured</div>
      )}
      {stream.isNew && !stream.featured && (
        <div className="absolute top-2 right-2 bg-green-500 text-xs px-1 rounded">New</div>
      )}
      <button className="absolute bottom-2 right-2 bg-pink-500 text-white px-2 py-1 rounded text-xs">
        Join
      </button>
    </a>
  );
};

export default StreamCard;
