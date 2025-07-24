const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startBtn = document.getElementById('startCall');
const ws = new WebSocket('ws://localhost:8080');
let pc;
let localStream;

// Listen for signaling messages over WebSocket and establish the peer connection
ws.addEventListener('message', async event => {
  const data = JSON.parse(event.data);
  if (!pc) await createPeer();
  if (data.offer) {
    // Received an SDP offer from the remote peer: set as remote and send answer
    await pc.setRemoteDescription(data.offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    ws.send(JSON.stringify({ answer }));
  } else if (data.answer) {
    // Received the answer to our offer: simply set it as remote description
    await pc.setRemoteDescription(data.answer);
  } else if (data.candidate) {
    // Add incoming ICE candidates to the peer connection
    try {
      await pc.addIceCandidate(data.candidate);
    } catch (e) {
      console.error('Error adding ICE candidate:', e);
    }
  }
});

// Creates the RTCPeerConnection and wire up event handlers
async function createPeer() {
  pc = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  });
  // Send ICE candidates to the remote peer over the signaling channel
  pc.onicecandidate = ({ candidate }) => {
    if (candidate) ws.send(JSON.stringify({ candidate }));
  };
  // When a remote track arrives, display it and trigger the Lovense device
  pc.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0];
    // Kick off a vibration if the Lovense integration is available
    if (window.lovense) {
      // call vibrateToy and handle any errors
      Promise.resolve(window.lovense.vibrateToy())
        .catch((err) => console.error('Lovense vibration error:', err));
    }
  };
  // Add our local media tracks to the connection
  if (localStream) {
    localStream.getTracks().forEach(t => pc.addTrack(t, localStream));
  }
}

// Handle click on the "Start Call" button: acquire media, connect Lovense, and start offer
startBtn.addEventListener('click', async () => {
  // Connect to Lovense first if available
  if (window.lovense) {
    try {
      await window.lovense.connectLovense();
    } catch (err) {
      console.error('Lovense connection error:', err);
    }
  }
  // Get access to the user's camera and microphone
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  localVideo.srcObject = localStream;
  // Initialize peer connection and create/send an offer
  await createPeer();
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  ws.send(JSON.stringify({ offer }));
});