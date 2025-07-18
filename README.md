# Feelynx

This repository contains a prototype of the Feelynx platform. A simple WebRTC demonstration is included for testing audio/video calls.

## Running the demo
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the signaling server:
   ```bash
   npm start
   ```
   This launches a WebSocket server on `ws://localhost:8080`.
3. Open `index.html` (or `webrtc.html`) in two separate browser windows. Navigate to the **Calls** tab and press **Start Call** in one of them to begin a peer‑to‑peer connection. Allow camera and microphone permissions when prompted.

The demo uses a basic WebSocket signaling server and `RTCPeerConnection` with Google's public STUN server. The `Calls` tab on the main site now embeds the same WebRTC demo.
