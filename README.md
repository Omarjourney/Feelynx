# Feelynx

This repository contains a prototype of the Feelynx platform. A simple WebRTC demonstration is included for testing audio/video calls.

## Running the demo
1. Copy `.env.example` to `.env` and fill in your Firebase and AWS credentials.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the signaling server (optionally set `PORT` to override the default 8080):
   ```bash
   PORT=3000 npm start
   ```
   This launches a WebSocket server on the chosen port (e.g. `ws://localhost:8080`).
   The WebRTC client automatically connects to the same host and port that served the page.
4. Open `index.html` (or `webrtc.html`) in two separate browser windows. Navigate to the **Calls** tab and press **Start Call** in one of them to begin a peer‑to‑peer connection. Allow camera and microphone permissions when prompted.

The demo uses a basic WebSocket signaling server and `RTCPeerConnection` with Google's public STUN server. The `Calls` tab on the main site now embeds the same WebRTC demo.

## Lovense Integration

`lovense.js` demonstrates a minimal connection to the local **Lovense Connect** API. When a call starts, the script attempts to discover any paired toys on `http://localhost:30010` and triggers a short vibration once the remote stream is received. Ensure the Lovense Connect app is running for the demo to work.

## Purchasing Vibecoins

Token packs can be previewed through the `feelynx-coins.html` page located in
the project root. Open this file directly in your browser (e.g.
`file:///path/to/feelynx-coins.html`) or, if you are serving the repository with
a local web server, navigate to `/feelynx-coins.html`. The page lists available
coin bundles and acts as a prototype checkout screen.

## Production Configuration

The server uses environment variables loaded from a `.env` file. For a
production deployment, ensure that `PORT` is set and any Firebase credentials
are provided. The server now applies basic security headers with `helmet` and
rate limiting via `express-rate-limit`. A simple health check endpoint is
available at `/health`.

### Media Uploads

Two new endpoints are available for creators to upload photos and videos:

```
POST /api/upload/photo
POST /api/upload/video
```

Both accept a `file` field in a `multipart/form-data` request. Uploaded files
are stored in the configured S3 bucket and the response contains the public URL
served via your CDN (`MEDIA_BASE_URL`).

Run the server in production mode with:

```bash
NODE_ENV=production npm start
```
