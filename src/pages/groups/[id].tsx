import React from 'react';
import ChatBox from '../../components/ChatBox';
import PostCard from '../../components/PostCard';
import type { Post } from '../../components/PostCard';

const pinned: Post[] = [
  { id: 99, type: 'image', src: 'https://placekitten.com/425/300', locked: false },
];

const posts: Post[] = [
  { id: 1, type: 'image', src: 'https://placekitten.com/420/300', locked: false },
  { id: 2, type: 'image', src: 'https://placekitten.com/421/300', locked: false },
];

const GroupPage: React.FC = () => {
  const id = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '';
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Group {id}</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          {pinned.map((p) => (
            <div key={p.id}>
              <div className="text-xs text-gray-400 mb-1">Pinned</div>
              <PostCard post={p} />
            </div>
          ))}
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
        <div className="flex flex-col space-y-2">
          <div className="flex-1 bg-gray-800 rounded overflow-hidden">
            <ChatBox />
          </div>
          <button className="bg-pink-500 rounded py-1">Schedule Stream</button>
        </div>
      </div>
    </div>
  );
};

export default GroupPage;
