import React, { useState } from 'react';
import LiveStreamCard from '../components/LiveStreamCard';

const mockCreators = [
  {
    id: 1,
    username: 'creator1',
    avatar: 'https://placekitten.com/210/200',
    online: true,
    rate: 2,
    viewers: 120,
    streamPreviewUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: 2,
    username: 'creator2',
    avatar: 'https://placekitten.com/211/200',
    online: false,
    rate: 1.5,
    viewers: 80,
    streamPreviewUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: 3,
    username: 'creator3',
    avatar: 'https://placekitten.com/212/200',
    online: true,
    rate: 3,
    viewers: 200,
    streamPreviewUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
];

const Creators: React.FC = () => {
  const [creators] = useState(mockCreators);
  return (
    <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {creators.map((c) => (
        <LiveStreamCard
          key={c.id}
          avatarUrl={c.avatar}
          username={c.username}
          viewerCount={c.viewers}
          isNew={!c.online}
          isFeatured={c.online}
          streamPreviewUrl={c.streamPreviewUrl}
        />
      ))}
    </div>
  );
};

export default Creators;
