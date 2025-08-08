# Feelynx Feature Roadmap

This document outlines high-level design notes for major enhancements to Feelynx. Each section describes goals, suggested technologies, and backend/frontend updates.

## 1. Live Streaming & Multi-Host Video
- Use [LiveKit](https://livekit.io/) as an SFU for scalable WebRTC streaming.
- "One-to-many" broadcasting: a room host publishes a video track; viewers subscribe.
- Multi-host mode: additional participants publish tracks with split-screen layout handled by LiveKit layouts.
- Backend: add session join/leave endpoints and track active hosts/viewers.
- Frontend: display current hosts and viewer count; allow co-host invitations.
- Infrastructure: host LiveKit server, configure TURN for NAT traversal.

## 2. In-App Gifts, Tips, Virtual Currency
- Introduce `TokenBalance` model linked to `User`.
- Purchase flow via Stripe Checkout for token packs stored in `tokenPackages.json`.
- Gift API: deduct tokens, persist `GiftEvent` with value and animation type.
- Frontend overlays show animation in real time using websockets.
- Maintain leaderboards of top contributors per room and globally.

## 3. Advanced Moderation & Reporting
- Real-time chat filtering using keyword lists and optional AI moderation.
- Add `Mute`, `Kick`, and `Ban` actions for moderators; store in `ModerationLog` table.
- Admin UI: list rooms, view reports, and apply actions.
- User reporting endpoint records `Report` entities with status workflow.

## 4. Social Login & User Profiles
- Integrate OAuth for Google, Facebook, and Apple using Passport.js or NextAuth.
- Profile fields: avatar, bio, links, badges, and view counts.
- Verification badge for admins or high-profile creators.

## 5. Interactive Chat, Polls & Events
- Support emoji reactions, pinned messages, slow mode via rate limiting.
- Poll model with options and vote counts; results broadcast to viewers.
- Q&A and mini events delivered through realtime messaging (e.g., websockets or LiveKit data channels).

## 6. Global Feed & Discovery
- `GET /rooms/live`: returns active rooms with preview, tags, and viewer counts.
- Search/filter by categories, languages, and popularity metrics.
- Frontend feed page lists trending streams and featured creators.

## 7. Mobile & Push Notifications
- Ensure responsive design using Tailwind's mobile breakpoints.
- Add web push notifications via service workers; suggest OneSignal or Firebase Cloud Messaging for cross-platform support.
- Optional: scaffold React Native app sharing components with web via Expo.

## 8. Compliance & Safety
- Age verification on signup with birthdate and optional ID checks.
- Maintain `blockedCountries` list to restrict access based on GeoIP.
- Implement GDPR-compliant data deletion and DMCA takedown workflow.

## 9. Analytics Dashboard
- Track per-stream metrics: concurrent viewers, watch time, gift revenue.
- Dashboard UI using React charts displaying earnings and engagement over time.
- Provide REST endpoints for creators to query stats.

## 10. Scaling, Storage, Productionization
- Migrate from file-based DB to PostgreSQL using Prisma as ORM.
- Store VOD recordings in S3-compatible storage; integrate CDN like Cloudflare.
- Add logging (e.g., Loki) and monitoring (Prometheus + Grafana).

These notes serve as a starting point for implementing the next generation of Feelynx features.
