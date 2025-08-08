import React, { useState } from 'react';
import SubscriptionPost from '../components/SubscriptionPost';

const mockPosts = [
  {
    id: 1,
    contentUrl: 'https://placekitten.com/400/300',
    isLocked: false,
    price: 0,
    isPPV: false,
    caption: 'Free cute cat',
    timestamp: 'Just now',
  },
  {
    id: 2,
    contentUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    isLocked: true,
    price: 5,
    isPPV: true,
    caption: 'Exclusive video',
    timestamp: '1h ago',
  },
  {
    id: 3,
    contentUrl: 'https://placekitten.com/401/300',
    isLocked: true,
    price: 10,
    isPPV: false,
    caption: 'Premium photo',
    timestamp: '2h ago',
  },
];

const Content: React.FC = () => {
  const [posts] = useState(mockPosts);
  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      {posts.map((p) => (
        <SubscriptionPost
          key={p.id}
          contentUrl={p.contentUrl}
          isLocked={p.isLocked}
          price={p.price}
          isPPV={p.isPPV}
          caption={p.caption}
          timestamp={p.timestamp}
        />
      ))}
    </div>
  );
};

export default Content;
