import React, { useEffect, useRef, useState } from 'react';

interface LiveStreamCardProps {
  avatarUrl: string;
  username: string;
  viewerCount: number;
  streamPreviewUrl: string;
  badge?: 'LIVE' | 'VIP' | 'NEW' | 'TRENDING';
  onWatch?: () => void;
}

const LiveStreamCard: React.FC<LiveStreamCardProps> = ({
  avatarUrl,
  username,
  viewerCount,
  streamPreviewUrl,
  badge,
  onWatch,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const base = process.env.VITE_MEDIA_BASE_URL || '';
  const avatarSrc = avatarUrl.startsWith('http') ? avatarUrl : `${base}${avatarUrl}`;
  const previewSrc = streamPreviewUrl.startsWith('http')
    ? streamPreviewUrl
    : `${base}${streamPreviewUrl}`;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 },
    );
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const badgeColor = {
    LIVE: 'bg-red-500',
    VIP: 'bg-purple-500',
    NEW: 'bg-green-500',
    TRENDING: 'bg-yellow-500',
  }[badge || 'LIVE'];

  return (
    <div
      ref={cardRef}
      className="relative bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg"
      onClick={onWatch}
      tabIndex={0}
    >
      <img src={avatarSrc} alt={username} className="w-full h-40 object-cover" />
      {isVisible && (
        <video
          src={previewSrc}
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}
      {/* dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/20 z-10" />
      <div className="absolute top-2 left-2 bg-black/60 text-xs px-1 rounded z-20">
        {viewerCount.toLocaleString()} watching
      </div>
      {badge && (
        <div
          className={`absolute top-2 right-2 ${badgeColor} text-xs px-1 rounded z-20`}
        >
          {badge}
        </div>
      )}
      <button
        className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-blue-600/80 text-white text-xs px-2 py-1 rounded z-20"
        onClick={(e) => {
          e.stopPropagation();
          onWatch?.();
        }}
      >
        Watch Now
      </button>
      <div className="p-2 text-sm z-20 relative pointer-events-none">@{username}</div>
    </div>
  );
};

export default LiveStreamCard;
