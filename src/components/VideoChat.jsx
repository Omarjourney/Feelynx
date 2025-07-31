import React from 'react';
import useWebRTC from '../hooks/useWebRTC';

export default function VideoChat({ clientId, targetId }) {
  const { localVideoRef, remoteVideoRef, startCall, endCall } = useWebRTC(clientId, targetId);

  return (
    <div className="p-4 space-y-2">
      <div className="flex space-x-2">
        <video ref={localVideoRef} autoPlay muted className="w-48 bg-black rounded" />
        <video ref={remoteVideoRef} autoPlay className="w-48 bg-black rounded" />
      </div>
      <div className="space-x-2">
        <button onClick={startCall} className="px-2 py-1 bg-pink-600 text-white rounded">Start Call</button>
        <button onClick={endCall} className="px-2 py-1 bg-gray-600 text-white rounded">End Call</button>
      </div>
    </div>
  );
}
