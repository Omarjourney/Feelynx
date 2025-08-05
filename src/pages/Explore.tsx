import React, { useState } from 'react';
import LiveStreamCard, { LiveStreamCardProps } from '../components/LiveStreamCard';

const mockStreams: Array<LiveStreamCardProps & { id: number }> = [
  {
    id: 1,
    username: 'creator1',
    viewerCount: 340,
    avatarUrl: 'https://placekitten.com/200/200',
    badge: 'TRENDING',
    streamPreviewUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: 2,
    username: 'creator2',
    viewerCount: 120,
    avatarUrl: 'https://placekitten.com/201/200',
    badge: 'NEW',
    streamPreviewUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: 3,
    username: 'creator3',
    viewerCount: 999,
    avatarUrl: 'https://placekitten.com/202/200',
    badge: 'LIVE',
    streamPreviewUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
];

const Explore: React.FC = () => {
  const [streams] = useState(mockStreams);

  return (
    <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {streams.map((s) => (
        <LiveStreamCard
          key={s.id}
          avatarUrl={s.avatarUrl}
          username={s.username}
          viewerCount={s.viewerCount}
          badge={s.badge}
          streamPreviewUrl={s.streamPreviewUrl}
        />
      ))}
    </div>
  );
};

export default Explore;
