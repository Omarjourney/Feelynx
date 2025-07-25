import React from 'react';
const Toolbar: React.FC = () => (
  <nav className="bg-gray-900 text-white p-4 flex space-x-4">
    <a href="/explore" className="hover:text-pink-400">Explore</a>
    <a href="/creators" className="hover:text-pink-400">Creators</a>
    <a href="/content" className="hover:text-pink-400">Content</a>
    <a href="/calls" className="hover:text-pink-400">Calls</a>
    <a href="/groups" className="hover:text-pink-400">Groups</a>
  </nav>
);

export default Toolbar;
