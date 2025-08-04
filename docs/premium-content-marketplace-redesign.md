# Premium Content Marketplace Redesign

## 1. Visual Feed & Discovery
- Present content in a responsive grid of **ContentCard** tiles that prioritize imagery.
- Each card displays a high‑resolution preview. Locked items show a blurred overlay with a **lock icon**.
- Supported media types are signaled with a corner badge (photo, video, voice, bundle, etc.).
- Optional overlays surface status such as *Trending*, *Selling Fast* or *Exclusive*.
- Price or token cost sits on the card front and center.
- Creator section includes avatar, username and a quick **Follow** button.

## 2. Interaction & Purchase Flow
- Clicking a locked card opens a rich modal.
  - Shows a blurred preview or a short free teaser clip when available.
  - Displays title, full description, categories/tags and creator profile summary.
  - Prominent unlock button supports one‑click purchase with available tokens.
  - Dynamic badges for promotions, discounts or timed drops.
  - Users may like, comment or share from the modal when allowed.
- After purchase the modal reveals the full unblurred media or deep‑links to a dedicated private page.

## 3. Personalized Recommendations & Sorting
- Tabs or sort toggles organize the feed:
  - **For You** – personalized from follows and history.
  - **Trending**, **Recently Added**, **Top Sellers**, **My Purchases**.
- Filters narrow results by media type, creator, price range, duration and tags.
- Infinite scroll or smooth \"load more\" paging keeps discovery continuous.

## 4. Bundles, Limited Offers & Subscriptions
- Bundle offers use distinct cards with banner styling and show the discounted total.
- Badges indicate subscriber discounts or when an item is part of a subscription tier.
- Support timed unlocks, pre‑sales or limited‑quantity drops with countdown/quantity indicators.

## 5. Additional UX Features
- Carousels or a rotating hero banner surface featured or pinned content at the top.
- Comments and like counts provide social proof on popular items.
- A \"Continue Watching/Reading\" row highlights recently unlocked items for returning users.
- Mobile‑first layout ensures thumb‑friendly tap targets and responsive grids.

## 6. React Component Layout & State
### ContentCard
- Props: `mediaSrc`, `mediaType`, `price`, `creator`, `badges`, `locked`, `onUnlock`.
- Handles locked/unlocked visuals and displays overlays.
- Lazy loads media and falls back to placeholders until loaded.

### MarketplaceFeed
- Fetches content via paginated API or GraphQL connections.
- Manages active tab, filters and sorting.
- Implements infinite scroll with intersection observers.

### ContentModal
- Receives selected item, shows teaser or full media based on `locked` state.
- Provides purchase action; updates global store on success.
- Hosts comments and reactions components when enabled.

### State Management
- Central store tracks user tokens, purchases, likes and follows.
- Optimistic updates keep UI responsive during purchases or reactions.

### Responsive Behavior
- Grid collapses from multi‑column on desktop to single column on small screens.
- Modals and carousels adapt for mobile with full‑screen overlays and swipe gestures.

## 7. Performance & Purchase Optimizations
- Use lazy loading and media optimization (blurhash, responsive sources) for fast initial render.
- Virtualize long lists to limit DOM nodes.
- Cache API responses and prefetch next pages during idle time.
- Support 1‑click purchase by storing encrypted payment auth and confirming with minimal steps.
- Defer loading of comments or heavy metadata until the modal is opened.

