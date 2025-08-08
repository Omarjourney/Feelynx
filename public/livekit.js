// Basic LiveKit client demo for Feelynx
// Expects server endpoint /livekit/token returning { token }

let room;

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startBtn = document.getElementById('startCall');
const endBtn = document.getElementById('endCall');

const LIVEKIT_URL = 'ws://localhost:7880';

async function startCall() {
  const res = await fetch(`/livekit/token?identity=user-${Math.floor(Math.random()*100000)}`);
  const { token } = await res.json();

  room = await LiveKit.connect(LIVEKIT_URL, token, {audio:true, video:true});

  room.localParticipant.tracks.forEach(pub => {
    const track = pub.track;
    if (track) localVideo.appendChild(track.attach());
  });

  room.on('trackSubscribed', (track, publication, participant) => {
    remoteVideo.appendChild(track.attach());
  });
}

startBtn.addEventListener('click', () => {
  startCall().catch(console.error);
});

endBtn.addEventListener('click', () => {
  room?.disconnect();
});
