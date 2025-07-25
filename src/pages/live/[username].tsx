import React, { useState } from 'react';
import VideoGrid from '../../components/VideoGrid';
import ChatBox from '../../components/ChatBox';
import TipModal from '../../components/TipModal';

const LivePage: React.FC = () => {
  const username =
    typeof window !== 'undefined'
      ? window.location.pathname.split('/').pop()
      : '';
  const [showTip, setShowTip] = useState(false);

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Live with {username}</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <VideoGrid count={9} />
          </div>
        <div className="flex flex-col space-y-2">
          <div className="flex-1 bg-gray-800 rounded overflow-hidden">
            <ChatBox />
          </div>
          <button className="bg-pink-500 rounded py-1" onClick={() => setShowTip(true)}>
            Send Gift
          </button>
        </div>
      </div>
      <TipModal open={showTip} onClose={() => setShowTip(false)} />
    </div>
  );
};

export default LivePage;
