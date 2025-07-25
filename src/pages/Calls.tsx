import React, { useState } from 'react';
import CallCard from '../components/CallCard';

const mockCallCreators = [
  { id: 1, username: 'creator1', avatar: 'https://placekitten.com/220/200', rate: 2.5 },
  { id: 2, username: 'creator2', avatar: 'https://placekitten.com/221/200', rate: 1.5 },
];

const Calls: React.FC = () => {
  const [creators] = useState(mockCallCreators);
  return (
    <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {creators.map(c => (
        <CallCard key={c.id} creator={c} />
      ))}
    </div>
  );
};

export default Calls;
