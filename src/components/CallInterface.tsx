import React, { useEffect, useRef, useState } from 'react';

interface Props {
  creator: { username: string };
  onEnd: () => void;
  rate: number;
}

const CallInterface: React.FC<Props> = ({ creator, onEnd, rate }) => {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const cost = ((seconds / 60) * rate).toFixed(2);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
      <div className="bg-gray-900 p-4 rounded text-center space-y-2 w-80">
        <div className="bg-gray-700 h-40 flex items-center justify-center rounded">Remote Video</div>
        <div className="bg-gray-700 h-20 flex items-center justify-center rounded">Local Video</div>
        <div className="text-sm">Time: {seconds}s • Cost: ${cost}</div>
        <button className="bg-red-600 w-full py-1 rounded" onClick={onEnd}>End Call</button>
      </div>
    </div>
  );
};

export default CallInterface;
