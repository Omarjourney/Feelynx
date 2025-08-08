import React from 'react';

const VideoGrid: React.FC<{ count: number }> = ({ count }) => (
  <div
    className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-black p-2 rounded text-white"
    style={{ height: '300px' }}
  >
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-gray-700 flex items-center justify-center">
        Video {i + 1}
      </div>
    ))}
  </div>
);

export default VideoGrid;
