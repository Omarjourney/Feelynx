import React, { useEffect, useState } from 'react';
import { Creator } from '../types';

// Fetch creators from the backend with optional query parameters
const Explorers: React.FC = () => {
  const [creators, setCreators] = useState<Pick<Creator, 'id' | 'username' | 'displayName' | 'avatar' | 'country' | 'specialty' | 'isLive'>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [country, setCountry] = useState('all');
  const [specialty, setSpecialty] = useState('all');
  const [liveOnly, setLiveOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'trendingScore' | 'createdAt' | 'followers'>('trendingScore');

  // Build query string and fetch creators
  const fetchCreators = () => {
    setLoading(true);
    setError('');
    const params = new URLSearchParams();
    if (country !== 'all') params.append('country', country);
    if (specialty !== 'all') params.append('specialty', specialty);
    if (liveOnly) params.append('isLive', 'true');
    if (search) params.append('search', search);
    params.append('sort', sort);

    fetch(`/api/creators?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error('failed');
        return res.json();
      })
      .then((data) => setCreators(data))
      .catch(() => setError('Failed to load creators'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCreators();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, specialty, liveOnly, search, sort]);

  return (
    <div className="p-4" aria-live="polite">
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <input
          className="border p-1 rounded text-sm"
          placeholder="Search creators"
          aria-label="Search creators"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border p-1 rounded text-sm"
          aria-label="Filter by country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="all">All Countries</option>
          <option value="US">US</option>
          <option value="CA">CA</option>
        </select>
        <select
          className="border p-1 rounded text-sm"
          aria-label="Filter by specialty"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
        >
          <option value="all">All Specialties</option>
          <option value="gaming">Gaming</option>
          <option value="music">Music</option>
        </select>
        <label className="flex items-center text-sm space-x-1">
          <input
            type="checkbox"
            checked={liveOnly}
            onChange={(e) => setLiveOnly(e.target.checked)}
            aria-label="Live now"
          />
          <span>Live now</span>
        </label>
        <div className="flex space-x-1 ml-auto">
          <button
            className={`px-2 py-1 rounded text-sm ${sort === 'trendingScore' ? 'bg-pink-500 text-white' : 'border'}`}
            onClick={() => setSort('trendingScore')}
          >
            Trending
          </button>
          <button
            className={`px-2 py-1 rounded text-sm ${sort === 'createdAt' ? 'bg-pink-500 text-white' : 'border'}`}
            onClick={() => setSort('createdAt')}
          >
            New
          </button>
          <button
            className={`px-2 py-1 rounded text-sm ${sort === 'followers' ? 'bg-pink-500 text-white' : 'border'}`}
            onClick={() => setSort('followers')}
          >
            Most Followers
          </button>
        </div>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {creators.map((c) => (
          <div key={c.id} className="border rounded p-2 text-center bg-gray-800 text-white">
            <img
              src={c.avatar}
              alt={c.displayName}
              className="w-full h-32 object-cover rounded"
            />
            <div className="mt-2 font-semibold">{c.displayName}</div>
            <div className="text-xs text-gray-400">@{c.username}</div>
            <div className="text-xs">
              {c.country} · {c.specialty}
            </div>
            {c.isLive && (
              <span className="inline-block mt-1 px-2 bg-green-500 text-xs rounded" aria-label="Live badge">
                Live
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explorers;
