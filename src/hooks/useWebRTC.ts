import { useRef, useState } from 'react';

export default function useWebRTC(_clientId: string, _targetId: string) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [mediaError, setMediaError] = useState('');
  const [connectionError] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const startCall = async () => {
    try {
      setIsConnecting(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      setMediaError(err?.message || 'Media error');
    } finally {
      setIsConnecting(false);
    }
  };

  const endCall = () => {
    const tracks = (localVideoRef.current?.srcObject as MediaStream | null)?.getTracks();
    tracks?.forEach((t) => t.stop());
  };

  return { localVideoRef, remoteVideoRef, startCall, endCall, mediaError, isConnecting, connectionError };
}
