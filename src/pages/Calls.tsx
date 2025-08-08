import React, { useState } from 'react';
import CallCard from '../components/CallCard';
import CallSession from '../components/CallSession';

const mockCallCreators = [
  { id: 1, username: 'creator1', avatar: 'https://placekitten.com/220/200', rate: 2.5 },
  { id: 2, username: 'creator2', avatar: 'https://placekitten.com/221/200', rate: 1.5 },
];

const Calls: React.FC = () => {
  const [creators] = useState(mockCallCreators);
  const [active, setActive] = useState<typeof mockCallCreators[0] | null>(null);

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {creators.map((c) => (
          <CallCard key={c.id} creator={c} onStart={() => setActive(c)} />
        ))}
      </div>
      {active && (
        <CallSession
          creatorName={active.username}
          ratePerMinute={active.rate}
          onEnd={() => setActive(null)}
        />
      )}
    </div>
  );
};

export default Calls;
