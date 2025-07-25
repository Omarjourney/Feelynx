// Enhanced WebRTC demo with basic call controls and Lovense integration
// This script handles UI states and peer connection setup.

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startBtn = document.getElementById('startCall');
const muteBtn = document.getElementById('muteButton');
const endBtn = document.getElementById('endCall');
const callStateEl = document.getElementById('callState');
const allowBtn = document.getElementById('allowPermissions');
const denyBtn = document.getElementById('denyPermissions');
const permissionModal = document.getElementById('permissionModal');

const livekitUrl = window.LIVEKIT_URL;
const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const wsPort = window.location.port ? `:${window.location.port}` : '';
const wsUrl = `${wsProtocol}://${window.location.hostname}${wsPort}`;
const ws = new WebSocket(wsUrl);
let pc;
let livekitRoom;
let localStream;
let muted = false;

function setState(state) {
  if (callStateEl) callStateEl.textContent = state;
}

// ----- Peer connection helpers -----
async function createPeer() {
  pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
  pc.onicecandidate = ({ candidate }) => {
    if (candidate) ws.send(JSON.stringify({ candidate }));
  };
  pc.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0];
    setState('Call in progress');
    // Vibrate toy when the call starts
    window.lovense?.startVibration?.();
  };
  if (localStream) {
    localStream.getTracks().forEach(t => pc.addTrack(t, localStream));
  }
}

async function connectLiveKit() {
  const identity = `user-${Math.floor(Math.random() * 1000)}`;
  const resp = await fetch(`/livekit-token?identity=${identity}`);
  const data = await resp.json();
  livekitRoom = await LivekitClient.connect(livekitUrl, data.token);
  const tracks = await LivekitClient.createLocalTracks({ audio: true, video: true });
  tracks.forEach((track) => {
    livekitRoom.localParticipant.publishTrack(track);
    if (track.kind === 'video') {
      track.attach(localVideo);
    } else if (track.kind === 'audio') {
      track.attach();
    }
  });
  livekitRoom.on('trackSubscribed', (track) => {
    if (track.kind === 'video') {
      track.attach(remoteVideo);
    } else if (track.kind === 'audio') {
      track.attach();
    }
    setState('Call in progress');
    window.lovense?.startVibration?.();
  });
}

ws.addEventListener('message', async event => {
  const data = JSON.parse(event.data);
  if (!pc) await createPeer();
  if (data.offer) {
    await pc.setRemoteDescription(data.offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    ws.send(JSON.stringify({ answer }));
  } else if (data.answer) {
    await pc.setRemoteDescription(data.answer);
  } else if (data.candidate) {
    try {
      await pc.addIceCandidate(data.candidate);
    } catch (e) {
      console.error('Error adding ICE candidate:', e);
    }
  }
});

function resetUI() {
  startBtn.classList.remove('hidden');
  muteBtn.classList.add('hidden');
  endBtn.classList.add('hidden');
  setState('Call ended');
  if (livekitRoom) {
    livekitRoom.disconnect();
    livekitRoom = null;
  }
  localVideo.srcObject = null;
  remoteVideo.srcObject = null;
  window.lovense?.stopVibration?.();
}

// ----- Button handlers -----
startBtn.addEventListener('click', () => {
  permissionModal.classList.remove('hidden');
});

denyBtn.addEventListener('click', () => {
  permissionModal.classList.add('hidden');
});

allowBtn.addEventListener('click', async () => {
  permissionModal.classList.add('hidden');
  setState('Connecting...');
  try {
    // Attempt to pair Lovense toy first
    await window.lovense?.pair?.();
    if (livekitUrl) {
      await connectLiveKit();
      muteBtn.classList.remove('hidden');
      endBtn.classList.remove('hidden');
      startBtn.classList.add('hidden');
      setState('Waiting for peer...');
    } else {
      localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideo.srcObject = localStream;
      muteBtn.classList.remove('hidden');
      endBtn.classList.remove('hidden');
      startBtn.classList.add('hidden');
      await createPeer();
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      ws.send(JSON.stringify({ offer }));
      setState('Waiting for peer...');
    }
  } catch (err) {
    console.error(err);
    setState('Error starting call');
  }
});

endBtn.addEventListener('click', () => {
  if (livekitRoom) {
    livekitRoom.disconnect();
    livekitRoom = null;
  }
  pc?.close();
  localStream?.getTracks().forEach(t => t.stop());
  resetUI();
});

muteBtn.addEventListener('click', () => {
  if (!localStream) return;
  muted = !muted;
  localStream.getAudioTracks().forEach(t => (t.enabled = !muted));
  muteBtn.textContent = muted ? 'Unmute' : 'Mute';
});

// Expose a helper for other scripts/tests
window.webrtcDemo = { resetUI };
