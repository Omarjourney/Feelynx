export {};

declare module './VideoChat' {
  import React from 'react';
  interface Props {
    clientId: string;
    targetId: string;
  }
  const VideoChat: React.FC<Props>;
  export default VideoChat;
}

declare module './components/VideoChat' {
  import VideoChat from './VideoChat';
  export default VideoChat;
}
