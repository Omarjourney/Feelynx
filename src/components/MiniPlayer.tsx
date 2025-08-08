import React from 'react';

interface MiniPlayerProps {
  streamUrl: string;
  username: string;
  onClose: () => void;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({ streamUrl, username, onClose }) => {
  const base = import.meta.env.VITE_MEDIA_BASE_URL || '';
  const src = streamUrl.startsWith('http') ? streamUrl : `${base}${streamUrl}`;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg overflow-hidden w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 text-white"
        >
          ✕
        </button>
        <video src={src} controls autoPlay className="w-full h-64 object-cover" />
        <div className="p-2 text-white">@{username}</div>
      </div>
    </div>
  );
};

export default MiniPlayer;
