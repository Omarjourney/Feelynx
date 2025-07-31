export default function useWebRTC(clientId: string, targetId: string): {
  localVideoRef: React.RefObject<HTMLVideoElement>;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  startCall: () => Promise<void>;
  endCall: () => void;
  mediaError: string;
  isConnecting: boolean;
};
