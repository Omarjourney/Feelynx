import React, { useState } from 'react';
import PostCard from '../components/PostCard';
import type { Post } from '../components/PostCard';

const mockPosts: Post[] = [
  { id: 1, type: 'image', src: 'https://placekitten.com/400/300', locked: false },
  { id: 2, type: 'video', src: 'https://www.w3schools.com/html/mov_bbb.mp4', locked: true, price: 5 },
  { id: 3, type: 'image', src: 'https://placekitten.com/401/300', locked: true, price: 3 },
];

const Content: React.FC = () => {
  const [posts] = useState(mockPosts);
  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      {posts.map(p => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  );
};

export default Content;
