import React, { useEffect, useState } from 'react';
import LiveStreamCard from '../components/LiveStreamCard';
import StoryBubble from '../components/StoryBubble';
import MiniPlayer from '../components/MiniPlayer';

interface Creator {
  id: number;
  username: string;
  avatar: string;
  viewers: number;
  streamUrl: string;
  badge: 'LIVE' | 'VIP' | 'NEW' | 'TRENDING';
  category: 'Trending' | 'Nearby' | 'New' | 'Personalized';
}

const mockCreators: Creator[] = [
  {
    id: 1,
    username: 'creator1',
    avatar: 'https://placekitten.com/210/200',
    viewers: 120,
    streamUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    badge: 'LIVE',
    category: 'Trending',
  },
  {
    id: 2,
    username: 'creator2',
    avatar: 'https://placekitten.com/211/200',
    viewers: 80,
    streamUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    badge: 'NEW',
    category: 'New',
  },
  {
    id: 3,
    username: 'creator3',
    avatar: 'https://placekitten.com/212/200',
    viewers: 200,
    streamUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    badge: 'VIP',
    category: 'Personalized',
  },
];

const tabs = ['All', 'Trending', 'Nearby', 'New', 'Personalized'];

const Creators: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [creators, setCreators] = useState<Creator[]>(mockCreators);
  const [selected, setSelected] = useState<Creator | null>(null);

  // Simulate viewer count ticking up for live creators
  useEffect(() => {
    const interval = setInterval(() => {
      setCreators((prev) =>
        prev.map((c) => ({
          ...c,
          viewers: c.badge === 'LIVE' ? c.viewers + Math.floor(Math.random() * 3) : c.viewers,
        })),
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filtered =
    activeTab === 'All'
      ? creators
      : creators.filter((c) => c.category === activeTab);

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-3 overflow-x-auto">
        {creators.map((c) => (
          <StoryBubble
            key={c.id}
            avatarUrl={c.avatar}
            username={c.username}
            isLive={c.badge === 'LIVE'}
            onClick={() => setSelected(c)}
          />
        ))}
        <StoryBubble
          avatarUrl="https://placekitten.com/100/100"
          username="Go Live"
          onClick={() => alert('Go Live')}
        />
      </div>
      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            className={`px-3 py-1 rounded ${
              activeTab === t ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filtered.map((c) => (
          <LiveStreamCard
            key={c.id}
            avatarUrl={c.avatar}
            username={c.username}
            viewerCount={c.viewers}
            badge={c.badge}
            streamPreviewUrl={c.streamUrl}
            onWatch={() => setSelected(c)}
          />
        ))}
      </div>
      {selected && (
        <MiniPlayer
          streamUrl={selected.streamUrl}
          username={selected.username}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};

export default Creators;
