# Feelynx

This repository contains a prototype of the Feelynx platform. A simple WebRTC demonstration is included for testing audio/video calls.

If you cannot access the official WebRTC guides, see [`docs/peer-connections-overview.md`](docs/peer-connections-overview.md) for a short walkthrough of creating a peer connection.

## Running the demo
1. Copy `.env.example` to `.env` and fill in your Firebase credentials.
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

## Lovense Integration

`lovense.js` demonstrates a minimal connection to the local **Lovense Connect** API. When a call starts, the script attempts to discover any paired toys on `http://localhost:30010` and triggers a short vibration once the remote stream is received. Ensure the Lovense Connect app is running for the demo to work.

## Purchasing Vibecoins

Token packs can be previewed through the `feelynx-coins.html` page located in
the project root. Open this file directly in your browser (e.g.
`file:///path/to/feelynx-coins.html`) or, if you are serving the repository with
a local web server, navigate to `/feelynx-coins.html`. The page lists available
coin bundles and acts as a prototype checkout screen.

## Offline Go Live Button

Commit `4d9acc0` removed the remote React and Babel dependencies previously used
by the Go Live widget. The button now works entirely offline using plain
JavaScript. Include the script directly:

```html
<script src="goLiveButton.js"></script>
```

## Production Configuration

The server uses environment variables loaded from a `.env` file. For a
production deployment, ensure that `PORT` is set and any Firebase credentials
are provided. The server now applies basic security headers with `helmet` and
rate limiting via `express-rate-limit`. A simple health check endpoint is
available at `/health`.

Run the server in production mode with:

```bash
NODE_ENV=production npm start
```

## CI and Docker Deployment

The repository includes a GitHub Actions workflow defined in
`.github/workflows/node.yml`. It installs dependencies, runs the test suite and
builds a Docker image for the application. When changes are pushed to the
`main` branch the workflow will also publish the image to GitHub Container
Registry (GHCR) using the `GITHUB_TOKEN` provided by GitHub.

### Triggering Production Deployments

Merges or pushes to `main` automatically build and publish the Docker image. A
deployment can also be initiated manually from the **Actions** tab by selecting
the **Node CI** workflow and pressing **Run workflow**. Ensure your account has
permissions to push packages so the image can be uploaded.

If you would like to deploy to another container registry or hosting provider,
edit the publish step in `node.yml` with your registry credentials.

## Dependency Audit

An included `audit.py` script scans a local folder or git repository for
mentions of particular technologies. Provide a path or repository URL with
`--source` and a space‑separated list of targets:

```bash
python audit.py --source https://github.com/some/project.git --targets react django
```

Results are saved to `audit_report.csv` detailing the first occurrence of each
target.

## Development

### Running tests

The test suite in `test.js` attempts to load `@prisma/client`. When that package
is not installed it automatically falls back to `prisma_client_stub.js` so the
tests can run without a database. Execute the tests with:

```bash
npm test
```

### Frontend build

The `src/` directory contains a React/TypeScript frontend compiled with Vite.
Use the dev server while working on the UI:

```bash
npm run dev
```

Generate production assets with:

```bash
npm run build
```
