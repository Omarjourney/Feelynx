# Feelynx

This repository contains a prototype of the Feelynx platform. A simple WebRTC demonstration is included for testing audio/video calls.

If you cannot access the official WebRTC guides, see [`docs/peer-connections-overview.md`](docs/peer-connections-overview.md) for a short walkthrough of creating a peer connection.

## Running the demo
1. Copy `.env.example` to `.env` and fill in your Firebase, AWS, Stripe, LiveKit and JWT credentials.
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

## LiveKit Setup

For a more fully featured experience you can run the project against [LiveKit](https://github.com/livekit/livekit), an open source WebRTC SFU. A minimal configuration file is provided as `livekit.yaml`.

1. Start LiveKit via Docker:

   ```bash
   ./scripts/start_livekit.sh
   ```

   Alternatively install the binary with `curl -sL https://get.livekit.io | bash` and run:

   ```bash
   livekit-server --config livekit.yaml
   ```

2. Set `LIVEKIT_HOST`, `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET` in your `.env` file.
3. Open `livekit.html` to initiate calls routed through LiveKit.

### Room Management

With your LiveKit credentials configured, the server exposes a few helper
endpoints for room management:

- `POST /livekit-room` – create a room. Pass JSON such as
  `{ "name": "myroom", "emptyTimeout": 600, "maxParticipants": 20 }`.
- `GET /livekit-room` – list all active rooms.
- `DELETE /livekit-room/:name` – delete a room by name.

These endpoints require `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET` to be set and
proxy directly to the LiveKit `RoomService` API.

## Lovense Integration

`lovense.js` now supports both the local **Lovense Connect** API and direct Web Bluetooth connections. When a call starts, the script first attempts to pair with a toy using `navigator.bluetooth`. If that fails it falls back to discovering toys via `http://localhost:30010` and triggers a short vibration once the remote stream is received.

For the Bluetooth path your browser must support the Web Bluetooth API and the toy must be in pairing mode. Otherwise ensure the Lovense Connect app is running so the HTTP fallback can control the device.

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

### Environment Variables

| Variable | Description |
| --- | --- |
| `PORT` | Port for the HTTP server (default 8080). |
| `JWT_SECRET` | Secret used to sign JSON Web Tokens. |
| `STRIPE_SECRET_KEY` | Stripe secret key for payments. |
| `STRIPE_WEBHOOK_SECRET` | Secret to verify Stripe webhooks. |
| `AWS_REGION` | AWS region of the S3 bucket. |
| `AWS_ACCESS_KEY_ID` | Access key for AWS SDK. |
| `AWS_SECRET_ACCESS_KEY` | Secret key for AWS SDK. |
| `S3_BUCKET` | Target S3 bucket for uploads. |
| `MEDIA_BASE_URL` | Public base URL for served media. |
| `LIVEKIT_HOST` | LiveKit server URL. |
| `LIVEKIT_API_KEY` | API key for LiveKit. |
| `LIVEKIT_API_SECRET` | API secret for LiveKit. |
| `FIREBASE_*` | Firebase configuration keys. |

### S3 Upload Folders

When using the `uploadToS3` helper, the `folder` argument must contain only
letters, numbers, hyphens, underscores or forward slashes. Leading or trailing
slashes and path traversal segments such as `..` are rejected.

Run the server in production mode with:

```bash
NODE_ENV=production npm start
```


