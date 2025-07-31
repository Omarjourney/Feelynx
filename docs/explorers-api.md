# Explorers API and Integration

This document outlines the demo "Explorers" feature which exposes a simple
creator discovery API and a matching React page.

## REST Endpoints

### `GET /api/creators`
Returns a JSON array of creators.
Query parameters:

- `country` – filter by ISO country code
- `specialty` – filter by creator specialty
- `isLive` – pass `true` to only return live creators
- `search` – case-insensitive match on username or display name
- `sort` – `trendingScore`, `createdAt`, or `followers`

### `POST /api/creators`
Adds a demo creator to the in-memory list. This is for testing only.

```
POST /api/creators
{ "username": "test", "displayName": "Test" }
```

## Database Model

A Prisma model is provided in `prisma/schema.prisma` which can be used with a
PostgreSQL database. Swap the provider to `mongodb` if a MongoDB deployment is
preferred.

## Real-Time Updates

The WebSocket server sends a welcome message on connection. It can be extended to
broadcast creator status changes:

```javascript
wss.clients.forEach(c => c.send(JSON.stringify({ type: 'status', id, live: true })))
```

## Extension Points

- **Payments** – integrate a payment provider to process tips and subscriptions.
- **Messaging** – add authenticated routes and database tables for private chats.
- **Group Rooms** – expand the WebSocket/LiveKit logic to manage multiple chat rooms.

Security, authentication and data validation should be carefully reviewed before
any production deployment.
