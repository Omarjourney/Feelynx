const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startBtn = document.getElementById('startCall');
const ws = new WebSocket('ws://localhost:8080');
let pc;
let localStream;

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
    try { await pc.addIceCandidate(data.candidate); } catch (e) {}
  }
});

async function createPeer() {
  pc = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  });
  pc.onicecandidate = ({ candidate }) => {
    if (candidate) ws.send(JSON.stringify({ candidate }));
  };
  pc.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0];
    if (window.lovense) {
      window.lovense.vibrateToy();
    }
  };
  if (localStream) {
    localStream.getTracks().forEach(t => pc.addTrack(t, localStream));
  }
}

startBtn.addEventListener('click', async () => {
  if (window.lovense) {
    window.lovense.connectLovense();
  }
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  localVideo.srcObject = localStream;
  await createPeer();
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  ws.send(JSON.stringify({ offer }));
});
