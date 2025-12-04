This repository is a TypeScript React frontend (Vite) for the Peryskop / Mental Health Charity product. The goal of this file is to give AI coding agents the essential, immediately actionable knowledge that helps them be productive in this codebase.

- Project start: run `npm run dev` (starts Vite on port 3000).
- Build: `npm run build` (runs `tsc -b` then `vite build`).
- Preview: `npm run preview`.
- Lint: `npm run lint`. Husky + `lint-staged` run Prettier + ESLint on staged files.

- Key env variables (used in `src/api.ts`):
  - `VITE_BASE_URL` — REST API base URL.
  - `VITE_BASE_WS_URL` — Websocket base URL.
  - `VITE_POSTHOG_KEY` — PostHog analytics key.

- High-level architecture:
  - Vite + React + TypeScript app. UI built with MUI (`@mui/material`).
  - Global providers live in `src/App.tsx`: `QueryClientProvider` (React Query), `UserProvider` (auth), `BrowserRouter`, MUI `ThemeProvider` and analytics (PostHog, Google Analytics).
  - Route table lives in `src/modules/shared/routes.tsx`. Routes are domain-driven and lazy-loaded via `React.lazy`. `RootRouter` enforces `requiresAuth` and `permission` fields.
  - Domain modules are under `src/modules/<domain>/` and follow a consistent layout: `components/`, `queries/`, `types.ts`, `constants.ts`, `hooks/`.

- API and networking conventions:
  - Centralized endpoints in `src/api.ts`. Use `buildQuery` (`src/helpers/buildQuery.ts`) for query string generation.
  - REST API helpers return full URLs (e.g. `url.chat.connect(options)`), and websocket endpoints use `VITE_BASE_WS_URL`.
  - Auth tokens: login stores `token` and `jwt_type` in cookies (`js-cookie`). `AuthProvider` (`src/modules/auth/components/AuthProvider`) reads the cookie and uses react-query to fetch `user` data.
  - Websockets: check `src/modules/chat` for websocket usage; `react-use-websocket` is a dependency.

- Patterns to follow when adding features:
  - Add domain logic under `src/modules/<domain>` following existing folders (`components`, `queries`, `types.ts`, `constants.ts`).
  - Place API call implementations as small functions in `queries/` and reference endpoint URLs from `src/api.ts`.
  - Types live in `types.ts` inside each module and are imported by components/queries.
  - UI components are functional React components with TypeScript props. Many screens use MUI and the app-wide theme (`src/theme.tsx`).

- Permissions & routing:
  - Routes declare `permission` (from `src/modules/shared/constants.ts`) and `requiresAuth`. `RootRouter` uses `useUser()` and `usePermissions()` to decide render vs redirect to login or 404.

- Testing & CI:
  - There are no test scripts in `package.json`. Keep changes small and rely on local `dev` and `build` for verification.

- Formatting & linting:
  - `prettier` + `eslint` enforced via `lint-staged` and `husky` pre-commit hook. Run `npm run lint` locally before commits.

- Useful files to inspect when debugging or changing behavior:
  - `src/App.tsx` — global providers and analytics bootstrapping.
  - `src/api.ts` — canonical place for endpoints and websocket URLs.
  - `src/modules/shared/routes.tsx` — application routes and permission patterns.
  - `src/modules/auth` — login/register flows and `AuthProvider` logic.
  - `src/helpers/buildQuery.ts` — canonical query-string builder used across the repo.

- Quick examples:
  - Add a new API endpoint: update `src/api.ts` to include the route, then create a `queries/<name>.ts` that calls `fetch`/`axios`/`useMutation` and uses types from `types.ts` in the same module.
  - Respect cookies: login flow stores token in `Cookies.set('token', ...)`. Use `AuthProvider` state transitions rather than reloading the page unnecessarily.

If anything here is unclear or you want me to expand examples (e.g. a sample `queries/` file or a checklist for adding a new route/module), tell me which section to expand and I will update this file.
