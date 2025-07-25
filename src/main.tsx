import React from 'react';
import ReactDOM from 'react-dom/client';
import VideoChat from './components/VideoChat';

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <VideoChat clientId="user1" targetId="user2" />
  </React.StrictMode>
);
