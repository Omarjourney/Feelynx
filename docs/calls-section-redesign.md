# Calls Section Redesign: Swipe-to-Connect Experience

This document outlines a redesign of the Calls section to make call discovery, matching, and calling more dynamic, social, and viral. The approach draws inspiration from apps such as Tophy and Who.

## 1. Discovery Feed → Swipe-to-Call
- Replace the static list with a swipeable **card stack** or carousel.
- Each card shows:
  - Large live preview or avatar.
  - Nickname, verification badges, live/online status.
  - Quick **About Me** tags (interests, specialties).
  - Call rate in big font (tokens per minute).
  - Quick tap to favorite or follow.
- Gestures:
  - **Swipe right** → request call.
  - **Swipe left** → skip to next profile.
- Optional mutual match cue: if both sides swipe right, display “It’s a match!” with instant call option.
- Persistent buttons at bottom:
  - Immediate **Video/Voice Call** trigger.
  - **Random Connect** toggle for auto‑pairing.

## 2. Interactive Matching & Calls
- **Random Call / One-Tap Connect** feature to pair users with available creators or fans.
- Live countdown/join modal with animated feedback while matching.
- Incoming call notifications for creators with accept/decline and profile preview.
- Online status indicated with colored badges or rippling glow animations.

## 3. In-Call Experience Upgrades
- Overlays show:
  - Real-time token meter (tokens per minute).
  - Gifting, emoji, flame/heart reactions, and an instant **Tip** button.
  - Option to record or save favorite moments (if allowed).
  - Swipe up/down to leave or disconnect.
- **Toy Sync Dashboard** as a persistent widget for live interactive devices showing intensity or triggers.

## 4. Community Features
- Leaderboards highlighting “most active callers,” “VIP members,” and “new creators.”
- Call history, favorite callers, and **call streak** badges similar to Who.

## 5. Onboarding & Safety
- First-time popover tutorial explaining how calling works.
- Reporting/blocking features and safety warnings before first call.
- Photo or voice verification support.
- Age filter and gender/interest matching for random calls and smart queue.

## 6. Technical Guidelines
- Frontend (React):
  - Use a responsive `CardStack` or `Swiper` component for profiles.
  - Lazy-load avatars and live thumbnails.
  - Listen for real-time presence/status updates to animate online badges.
  - Smooth transitions for matches, joining, and hang-ups.
- Performance & Mobile:
  - Mobile-first layout; fast, single-tap navigation.
  - Keep card stack hot-loaded for instant swipe, like TikTok or Tophy.
  - Optimize asset delivery and prefetch next profile data.

## 7. Example User Journey
1. **Open Calls** → card stack appears.
2. **Swipe** through previews → **right** to request, **left** to skip.
3. **Tap connect** → instant video/voice call with countdown.
4. **In-call overlay** shows token meter, reactions, Toy Sync dashboard.
5. **End call** with swipe up/down → rate or favorite → return to stack.
6. **Random connect** optional for next call; repeat to build streaks.

