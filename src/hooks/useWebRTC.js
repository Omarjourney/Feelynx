import { useEffect, useRef, useCallback, useState } from 'react';

export default function useWebRTC(clientId, targetId) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const wsRef = useRef(null);
  const pcRef = useRef(null);
  const streamRef = useRef(null);
  const wsReadyRef = useRef(null);
  const messageQueueRef = useRef([]);
  const [mediaError, setMediaError] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState('');

  const sendMessage = async (msg) => {
    const data = typeof msg === 'string' ? msg : JSON.stringify(msg);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(data);
      return;
    }
    messageQueueRef.current.push(data);
    if (wsReadyRef.current) {
      await wsReadyRef.current;
    }
  };

  useEffect(() => {
    setConnectionError('');
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const hostname = window.location.hostname || 'localhost';
    const port = window.location.port || import.meta.env.VITE_WS_PORT || '8080';
    wsRef.current = new WebSocket(
      `${protocol}://${hostname}${port ? `:${port}` : ''}/ws`
    );

    wsReadyRef.current = new Promise((resolve) => {
      wsRef.current.onopen = () => {
        messageQueueRef.current.forEach((m) => wsRef.current.send(m));
        messageQueueRef.current.length = 0;
        resolve();
      };
    });

    wsRef.current.onerror = (err) => {
      console.error('WebSocket connection error', err);
      setConnectionError(err?.message || 'WebSocket connection error');
    };

    wsRef.current.onclose = () => {
      setConnectionError('WebSocket connection closed');
    };

    wsRef.current.onmessage = async (event) => {
      let msg;
      try {
        msg = JSON.parse(event.data);
      } catch (err) {
        console.error('Failed to parse WebSocket message', err);
        return;
      }
      if (msg.to && msg.to !== clientId) return;
      await ensurePeer();
      if (msg.offer) {
        await pcRef.current.setRemoteDescription(msg.offer);
        const answer = await pcRef.current.createAnswer();
        await pcRef.current.setLocalDescription(answer);
        await sendMessage({ from: clientId, to: msg.from, answer });
      } else if (msg.answer) {
        await pcRef.current.setRemoteDescription(msg.answer);
      } else if (msg.candidate) {
        try {
          await pcRef.current.addIceCandidate(msg.candidate);
        } catch {}
      }
    };

    return () => {
      wsRef.current?.close();
      pcRef.current?.close();
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, [clientId, targetId]);

  const ensurePeer = async () => {
    if (pcRef.current) return;
    pcRef.current = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    pcRef.current.onicecandidate = async ({ candidate }) => {
      if (candidate) await sendMessage({ from: clientId, to: targetId, candidate });
    };
    pcRef.current.ontrack = (e) => {
      remoteVideoRef.current.srcObject = e.streams[0];
    };
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => pcRef.current.addTrack(t, streamRef.current));
    }
  };

  const startCall = useCallback(async () => {
    setMediaError('');
    setIsConnecting(true);
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = streamRef.current;
      await ensurePeer();
      streamRef.current.getTracks().forEach(t => pcRef.current.addTrack(t, streamRef.current));
      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);
      await sendMessage({ from: clientId, to: targetId, offer });
    } catch (err) {
      setMediaError('Unable to access camera or microphone');
    } finally {
      setIsConnecting(false);
    }
  }, [clientId, targetId]);

  const endCall = useCallback(() => {
    pcRef.current?.close();
    pcRef.current = null;
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  }, []);

  return {
    localVideoRef,
    remoteVideoRef,
    startCall,
    endCall,
    mediaError,
    isConnecting,
    connectionError
  };
}
