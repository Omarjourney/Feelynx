import React, { useEffect, useRef, useState } from 'react';

interface CallSessionProps {
  creatorName: string;
  ratePerMinute: number;
  onEnd?: () => void;
}

const CallSession: React.FC<CallSessionProps> = ({ creatorName, ratePerMinute, onEnd }) => {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<number>();

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const cost = ((seconds / 60) * ratePerMinute).toFixed(2);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
      <div className="bg-gray-900 p-4 rounded text-center space-y-2 w-80">
        <div className="bg-gray-700 h-48 flex items-center justify-center rounded text-sm">Remote Video - {creatorName}</div>
        <div className="bg-gray-700 h-24 flex items-center justify-center rounded text-sm">Your Video</div>
        <div className="text-sm">Time: {seconds}s • Cost: ${cost}</div>
        <button className="bg-red-600 w-full py-1 rounded" onClick={onEnd}>End Call</button>
      </div>
    </div>
  );
};

export default CallSession;
