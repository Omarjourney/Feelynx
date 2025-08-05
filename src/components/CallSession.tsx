import React, { useEffect, useRef, useState } from 'react';
import useWebRTC from '../hooks/useWebRTC';

interface CallSessionProps {
  creatorName: string;
  ratePerMinute: number;
  onEnd?: () => void;
}

const CallSession: React.FC<CallSessionProps> = ({ creatorName, ratePerMinute, onEnd }) => {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const { localVideoRef, remoteVideoRef, startCall, endCall, mediaError, isConnecting } = useWebRTC('local', creatorName);

  useEffect(() => {
    startCall();
    intervalRef.current = window.setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
      endCall();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cost = ((seconds / 60) * ratePerMinute).toFixed(2);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
      <div className="bg-gray-900 p-4 rounded text-center space-y-2 w-80">
        <div className="bg-gray-700 h-48 flex items-center justify-center rounded text-sm">
          {isConnecting ? (
            <span>Connecting...</span>
          ) : (
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
          )}
        </div>
        <div className="bg-gray-700 h-24 flex items-center justify-center rounded text-sm">
          <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
        </div>
        {mediaError && <div className="text-red-500 text-sm">{mediaError}</div>}
        <div className="text-sm">Time: {seconds}s • Cost: ${cost}</div>
        <button className="bg-red-600 w-full py-1 rounded" onClick={onEnd}>End Call</button>
      </div>
    </div>
  );
};

export default CallSession;
