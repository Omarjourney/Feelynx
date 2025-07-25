import React, { useState } from 'react';
import TipModal from './TipModal';

interface SubscriptionPostProps {
  contentUrl: string;
  isLocked: boolean;
  price?: number;
  isPPV?: boolean;
  caption?: string;
  timestamp: string;
}

const SubscriptionPost: React.FC<SubscriptionPostProps> = ({
  contentUrl,
  isLocked,
  price = 0,
  isPPV,
  caption,
  timestamp,
}) => {
  const [unlocked, setUnlocked] = useState(!isLocked);
  const [showTip, setShowTip] = useState(false);

  const unlock = () => {
    setUnlocked(true);
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden relative">
      <img
        src={contentUrl}
        alt="post"
        className={`w-full ${unlocked ? '' : 'blur-md'}`}
      />
      {!unlocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 space-y-2">
          <button
            onClick={unlock}
            className="bg-pink-500 text-white px-3 py-1 rounded"
          >
            {isPPV ? `Unlock for $${price}` : `Subscribe $${price}`}
          </button>
        </div>
      )}
      <div className="p-2 space-y-1 text-sm">
        {caption && <div>{caption}</div>}
        <div className="text-xs text-gray-400">{timestamp}</div>
        <div className="flex space-x-4 pt-1">
          <button className="hover:text-pink-400">Like</button>
          <button className="hover:text-pink-400">Comment</button>
          <button className="hover:text-pink-400" onClick={() => setShowTip(true)}>
            Tip
          </button>
        </div>
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

export default SubscriptionPost;
