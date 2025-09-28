# Little John Mobile App Architecture

_Last updated: September 28, 2025_

## 🧭 Overview
Little John is a React Native (0.76) application targeting iOS and Android. It combines Solana wallet connectivity, campaign-based reward flows, and equity/crypto portfolio tracking. The client is responsible for rendering the full experience, communicating with RESTful backends hosted under `https://littlejohn.fi/api/v0` (development override `http://10.0.2.2:3000/api/v0`).

Primary pillars:
- **Navigation-first UX** blending a stack navigator with a five-tab bar.
- **Wallet-centric state** via the Solana Mobile Wallet Adapter.
- **Lean Redux usage** for theming and language while most data is fetched per screen.
- **Feature toggles & prototypes**: several flows are stubbed/in-progress (e.g., transfer service, payment methods).

## 🏗️ App structure at a glance
```
src/
├─ navigation/   → Stack & tab navigators, route registries
├─ containers/   → Screen-level React components grouped by domain
├─ components/   → Reusable UI primitives (headers, lists, forms)
├─ api/          → Fetch helpers, endpoint wrappers, static mock data
├─ providers/    → Context providers (e.g., AccountProvider for wallets)
├─ redux/        → Minimal global state (theme, language)
├─ services/     → Solana swap/transfer helpers
├─ themes/       → Color palettes, typography, spacing utilities
└─ utils/        → AsyncStorage helpers, validators, miscellaneous
```
Supporting assets live under `src/assets`, while `android/` and `ios/` contain native project scaffolding.

## 🚦 Navigation & flows
React Navigation drives the UI:
- **Root**: `NavigationContainer` → `StackNavigation` (`src/navigation/Type/StackNavigation.js`).
- **Entry path**: `Splash` checks AsyncStorage keys (`THEME`, `ON_BOARDING`, `ACCESS_TOKEN`) to decide between onboarding, auth, or the tab bar.
- **Auth stack**: Currently exposes `WalletScreen`, which triggers wallet authorization; additional KYC screens live in `src/containers/auth/` for future wiring.
- **Tab bar** (`TabBarNavigation`):
  - `HomeTab` – dashboard with cash balance and curated asset lists.
  - `PortfolioTab` – performance chart, positions, and metrics.
  - `DiscoverTab` – searchable catalog with category chips and daily auto-refresh.
  - `MoreTab` – operational utilities (asset transfers, funding activity, placeholders for future features).
  - `AccountTab` – wallet details, theme toggle, logout, and campaign entry points.
- **Shared stack screens**: Buy/sell, transfer flows, account settings, help center, campaign screens, and a generic `IncommingFeature` placeholder for unfinished routes.

### Campaign gating
- `AccountTab` checks `getSeekerVerificationStatus` (GET `campaign/seeker-status/{pubkey}`) to determine if the user can access the Quest rewards screen.
- Non-verified users are routed to `SeekerPhoneVerification`, which reuses `verify-seeker-phone` POST endpoint to validate Seeker Genesis Token ownership before unlocking `Quest`.

## 🧠 State management
- **Context**: `AccountProvider` handles wallet connectivity, storing `authToken` and `base64Address` in AsyncStorage and exposing `currentAccount`, `connect`, `disconnect`, `signTransactions`.
- **Redux**: Tiny store with two reducers:
  - `theme` – toggles between light and dark palettes.
  - `profile` – tracks the UI language (default `English(US)`).
  Middleware: Redux Thunk, primarily for future async expansion.
- **AsyncStorage keys**: `THEME`, `ON_BOARDING`, `ACCESS_TOKEN`, plus wallet data persisted by the account provider.

## 🔌 Data access & integrations
- **HTTP helpers**: `callApiGet` / `callApiPost` compose URLs against the API base and expect JSON responses.
- **Portfolio endpoints** (`src/api/stocks.js`):
  - `GET portfolio/{pubkey}` → positions, history, balances.
  - `GET portfolio/{pubkey}/cash/` → cash-only view.
  - `GET portfolio/{pubkey}/asset/{tokenAddress}?period={period}` → asset-specific history.
  - `GET static/assets` → catalog of equities/ETFs feeding Discover & Home lists.
- **Campaign endpoints** (`src/api/campaign.js`):
  - `POST campaign/verify-seeker-phone` → re-used for both phone & Genesis Token checks.
  - `GET campaign/seeker-status/{pubkey}` → boolean verification state + metadata.
- **Solana services**:
  - `SwapService` integrates Jupiter quote/swap APIs and handles transaction signing/resubmission.
  - `TransferService` currently simulates Solana transfers with validation hooks, ready for backend wiring.
  - `TestTransactionService` builds a simple SOL self-transfer for diagnostics.
- **Mock data**: `src/api/constant.js` houses extensive sample datasets for stocks, quests, settings, etc.—used when backend responses are missing or to populate placeholder UI.

## 📱 Key screens & responsibilities
| Screen | Path | Responsibilities |
| ------ | ---- | ---------------- |
| `HomeTab` | `src/containers/tabbar/home/HomeTab.js` | Display cash balance, ETFs carousel, all stocks list; deposit CTA and (commented) wishlist/notifications. |
| `PortfolioTab` | `.../portfolio/PortfolioTab.js` | Render portfolio chart, summary metrics, positions, and empty state when no holdings. |
| `DiscoverTab` | `.../discover/DiscoverTab.js` | Search/filter assets, manage daily auto-refresh, show top movers and categories. |
| `BuySell` | `.../home/BuySell.js` | Initiate swap quotes via `SwapService`, fetch cash/token balances, guard insufficient funds. |
| `AccountTab` | `.../account/AccountTab.js` | Wallet display, theme toggle, contact actions, campaign verification gating, logout. |
| `SeekerPhoneVerification` | `src/containers/auth/SeekerPhoneVerification.js` | Execute Genesis Token verification, manage happy/failed paths, route to Quest. |
| `Quest` | `.../account/Quest.js` | Showcase campaign quests, outbound links to campaign destinations. |

## 🔍 Logging & observability
- **Current state**: relies on `console.log` for stock category logging and service diagnostics. No persistent `.log` file exists yet.
- **Recommended next step**: integrate `react-native-fs` (or similar) to append asset-category logs to a local file and establish a unified logging service that can forward events to remote analytics when available.

## ⚠️ Edge cases & resilience notes
1. **Wallet connectivity**: Many flows assume `currentAccount` exists. Guard rails alert and abort when the wallet is absent, but UX could be improved with re-auth prompts.
2. **API fragility**: Fetch helpers lack try/catch; non-JSON or network failures bubble as unhandled promise rejections.
3. **Timer cleanup**: Discover tab auto-refresh uses hourly intervals; ensure timers clear on unmount/background to avoid leaks.
4. **Mock vs real data**: Some screens still depend on static mocks—verify backend feature parity before shipping.
5. **Swap volatility**: Quote requests may fail for illiquid assets; error UI provides messages but lacks retry suggestions or fallback pricing.

## 🛣️ Roadmap & opportunities
- **Short term**
  - Add persistent logging for stock categories to meet product ask.
  - Wrap API calls with error boundaries and user-facing messages.
  - Externalize API base URLs via environment configuration per platform/build type.
- **Medium term**
  - Replace large mock datasets with typed DTOs and caching (React Query or RTK Query).
  - Expand AuthStack beyond `WalletScreen` to the full onboarding/KYC workflow.
  - Harden swap & transfer services with real backend support and transaction monitoring.
- **Long term**
  - Integrate analytics/telemetry (Amplitude, Segment, or custom pipeline) with consent management.
  - Modularize navigation into feature stacks to tame `StackNavigation.js` size.
  - Introduce automated smoke tests for critical flows (wallet connect, buy, discover search).

## 📎 References
- Entry point: `src/index.js`
- Navigation registry: `src/navigation/NavigationRoutes.js`
- Wallet provider: `src/providers/AccountProvider.js`
- API helpers: `src/api/index.js`, `src/api/stocks.js`, `src/api/campaign.js`
- Mock data catalog: `src/api/constant.js`
- Theming: `src/themes/`

For deeper domain or component-level insights, refer to the inline comments within each module and the existing `docs/` assets.
