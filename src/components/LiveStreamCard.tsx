import React, { useState } from 'react';

interface LiveStreamCardProps {
  avatarUrl: string;
  username: string;
  viewerCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  streamPreviewUrl: string;
}

const LiveStreamCard: React.FC<LiveStreamCardProps> = ({
  avatarUrl,
  username,
  viewerCount,
  isNew,
  isFeatured,
  streamPreviewUrl,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const base = process.env.VITE_MEDIA_BASE_URL || '';
  const avatarSrc = avatarUrl.startsWith('http') ? avatarUrl : `${base}${avatarUrl}`;
  const previewSrc = streamPreviewUrl.startsWith('http')
    ? streamPreviewUrl
    : `${base}${streamPreviewUrl}`;

  return (
    <a
      href={`/live/${username}`}
      className="relative block bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg"
      onMouseEnter={() => setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
      onFocus={() => setShowPreview(true)}
      onBlur={() => setShowPreview(false)}
    >
      <img src={avatarSrc} alt={username} className="w-full h-40 object-cover" />
      {showPreview && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <video
            src={previewSrc}
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="absolute top-2 left-2 bg-red-500 text-xs px-1 rounded">
        {viewerCount} watching
      </div>
      {isFeatured && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-xs px-1 rounded">
          Featured
        </div>
      )}
      {isNew && !isFeatured && (
        <div className="absolute top-2 right-2 bg-green-500 text-xs px-1 rounded">
          New
        </div>
      )}
      <div className="p-2 text-sm">@{username}</div>
    </a>
  );
};

export default LiveStreamCard;
