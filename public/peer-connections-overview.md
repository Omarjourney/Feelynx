<!--
  This file is a copy of the WebRTC peer connection overview from the
  `docs` folder.  It is placed in the `public` directory so it can be
  served by Express and FastAPI without any additional build steps.  If
  you update the original document, please copy those changes here as
  well.  Keeping the guide in the public folder allows it to be
  accessible offline via the "Peer Connection Guide" button on the Calls
  tab and on the dedicated WebRTC demo page.
-->

# WebRTC Peer Connection Overview

This document summarizes the key steps for establishing a basic peer‑to‑peer
connection using WebRTC. It is an alternative to the "Peer Connections"
guide from `webrtc.org` which may be inaccessible in some environments.

## 1. Gather local media
Use `navigator.mediaDevices.getUserMedia()` to request access to the user's
camera and microphone. Attach the resulting stream to a local `<video>`
element so the user can see their own feed.

```javascript
const localStream = await navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true,
});
localVideo.srcObject = localStream;
```

## 2. Create an `RTCPeerConnection`
Instantiate a new `RTCPeerConnection`, optionally providing STUN/TURN
servers for NAT traversal. Add the tracks from the local stream to the
connection.

```javascript
const pc = new RTCPeerConnection({
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
});
localStream.getTracks().forEach((t) => pc.addTrack(t, localStream));
```

## 3. Exchange offers and answers
Use a signaling mechanism (for example, WebSocket) to exchange SDP offers
and answers between peers.

```javascript
const offer = await pc.createOffer();
await pc.setLocalDescription(offer);
// send offer to the remote peer
```

When an offer is received, set it as the remote description, create an
answer, and send it back.

```javascript
await pc.setRemoteDescription(remoteOffer);
const answer = await pc.createAnswer();
await pc.setLocalDescription(answer);
// send answer to the caller
```

## 4. Handle ICE candidates
As ICE candidates become available, share them with the remote peer and
add the received candidates to the connection.

```javascript
pc.onicecandidate = (event) => {
  if (event.candidate) {
    // send candidate to remote peer
  }
};

// when receiving a candidate from remote
await pc.addIceCandidate(remoteCandidate);
```

## 5. Display the remote stream
When tracks from the remote peer are added to the connection, attach
them to a `<video>` element so users can see and hear each other.

```javascript
pc.ontrack = (event) => {
  remoteVideo.srcObject = event.streams[0];
};
```

These steps form the core of setting up a WebRTC peer connection. The
accompanying `webrtc.js` file in this repository provides a working
example using a simple WebSocket signaling server.
