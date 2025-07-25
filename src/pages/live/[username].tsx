import React from 'react';
import VideoGrid from '../../components/VideoGrid';

const LivePage: React.FC = () => {
  const username =
    typeof window !== 'undefined'
      ? window.location.pathname.split('/').pop()
      : '';

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Live with {username}</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <VideoGrid count={6} />
        </div>
        <div className="flex flex-col space-y-2">
          <div className="flex-1 bg-gray-800 rounded p-2 overflow-auto">Chat</div>
          <div className="bg-gray-800 rounded p-2">Tipping UI</div>
        </div>
      </div>
    </div>
  );
};

export default LivePage;
