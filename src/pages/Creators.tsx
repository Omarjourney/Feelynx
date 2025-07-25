import React, { useState } from 'react';
import CreatorCard from '../components/CreatorCard';

const mockCreators = [
  { id: 1, username: 'creator1', avatar: 'https://placekitten.com/210/200', online: true, rate: 2 },
  { id: 2, username: 'creator2', avatar: 'https://placekitten.com/211/200', online: false, rate: 1.5 },
  { id: 3, username: 'creator3', avatar: 'https://placekitten.com/212/200', online: true, rate: 3 },
];

const Creators: React.FC = () => {
  const [creators] = useState(mockCreators);
  return (
    <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {creators.map(c => (
        <CreatorCard key={c.id} creator={c} />
      ))}
    </div>
  );
};

export default Creators;
