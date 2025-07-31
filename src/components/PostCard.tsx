import React, { useState } from 'react';
import TipModal from './TipModal';

export interface Post {
  id: number;
  type: 'image' | 'video';
  src: string;
  locked: boolean;
  price?: number;
}

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const [unlocked, setUnlocked] = useState(!post.locked);
  const [showTip, setShowTip] = useState(false);
  const base = process.env.VITE_MEDIA_BASE_URL || '';
  const src = post.src.startsWith('http') ? post.src : `${base}${post.src}`;

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      {post.type === 'image' ? (
        <img src={src} alt="post" className={unlocked ? '' : 'blur-sm'} />
      ) : (
        <video controls className={unlocked ? '' : 'blur-sm'} src={src} />
      )}
      {!unlocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 space-y-2">
          <button
            onClick={() => setUnlocked(true)}
            className="bg-pink-500 text-white px-3 py-1 rounded"
          >
            {post.price ? `Unlock for $${post.price}` : 'Subscribe to view'}
          </button>
        </div>
      )}
      <div className="p-2 flex space-x-4 text-sm">
        <button className="hover:text-pink-400">Like</button>
        <button className="hover:text-pink-400">Comment</button>
        <button className="hover:text-pink-400">Repost</button>
        <button className="hover:text-pink-400" onClick={() => setShowTip(true)}>
          Tip
        </button>
      </div>
      <TipModal
        isOpen={showTip}
        onClose={() => setShowTip(false)}
        onSubmit={(amt) => {
          console.log('tip', amt);
          setShowTip(false);
        }}
      />
    </div>
  );
};

export default PostCard;
