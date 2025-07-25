import React, { useState } from 'react';
import LiveStreamCard from '../components/LiveStreamCard';

const mockStreams = [
  {
    id: 1,
    username: 'creator1',
    viewers: 340,
    avatar: 'https://placekitten.com/200/200',
    featured: true,
    streamPreviewUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: 2,
    username: 'creator2',
    viewers: 120,
    avatar: 'https://placekitten.com/201/200',
    featured: false,
    isNew: true,
    streamPreviewUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: 3,
    username: 'creator3',
    viewers: 999,
    avatar: 'https://placekitten.com/202/200',
    featured: true,
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
          avatarUrl={s.avatar}
          username={s.username}
          viewerCount={s.viewers}
          isNew={s.isNew}
          isFeatured={s.featured}
          streamPreviewUrl={s.streamPreviewUrl}
        />
      ))}
    </div>
  );
};

export default Explore;
