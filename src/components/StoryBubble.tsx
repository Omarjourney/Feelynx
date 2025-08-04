import React from 'react';

interface StoryBubbleProps {
  avatarUrl: string;
  username: string;
  isLive?: boolean;
  onClick?: () => void;
}

const StoryBubble: React.FC<StoryBubbleProps> = ({
  avatarUrl,
  username,
  isLive,
  onClick,
}) => {
  const base = process.env.VITE_MEDIA_BASE_URL || '';
  const avatarSrc = avatarUrl.startsWith('http') ? avatarUrl : `${base}${avatarUrl}`;

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center focus:outline-none"
    >
      <div
        className={`relative rounded-full p-[2px] ${
          isLive
            ? 'bg-gradient-to-tr from-pink-500 to-red-500 animate-pulse'
            : 'bg-gray-500'
        }`}
      >
        <img
          src={avatarSrc}
          alt={username}
          className="w-16 h-16 rounded-full object-cover"
        />
        {isLive && (
          <span className="absolute bottom-0 right-0 bg-red-500 text-[10px] text-white px-1 rounded">
            LIVE
          </span>
        )}
      </div>
      <span className="mt-1 text-xs">@{username}</span>
    </button>
  );
};

export default StoryBubble;
