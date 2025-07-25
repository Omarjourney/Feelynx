import React, { useState } from 'react';

export interface Post {
  id: number;
  type: 'image' | 'video';
  src: string;
  locked: boolean;
}

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const [unlocked, setUnlocked] = useState(!post.locked);

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      {post.type === 'image' ? (
        <img src={post.src} alt="post" className={unlocked ? '' : 'blur-sm'} />
      ) : (
        <video controls className={unlocked ? '' : 'blur-sm'} src={post.src} />
      )}
      {!unlocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
          <button
            onClick={() => setUnlocked(true)}
            className="bg-pink-500 text-white px-3 py-1 rounded"
          >
            Subscribe to view
          </button>
        </div>
      )}
      <div className="p-2 flex space-x-4 text-sm">
        <button>Like</button>
        <button>Comment</button>
        <button>Tip</button>
      </div>
    </div>
  );
};

export default PostCard;
