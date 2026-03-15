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

    - Vite + React 18 + TypeScript 5 app.
    - **UI stack**: shadcn/ui (base-nova style, built on `@base-ui/react`) + Tailwind CSS v4 + Lucide React icons.
    - Tailwind theme and shadcn semantic tokens are defined in `src/main.css` using `@theme` blocks and CSS custom properties.
    - The `cn()` utility (`src/lib/utils.ts`) combines `clsx` + `tailwind-merge` for conditional class composition.
    - shadcn/ui components live in `src/components/ui/`. Custom form wrappers (Formik-integrated) live in `src/components/form/`.
    - Global providers live in `src/App.tsx`: `QueryClientProvider` (React Query), `UserProvider` (auth), `BrowserRouter`, and analytics (PostHog, Google Analytics).
    - Route table lives in `src/modules/shared/routes.tsx`. Routes are domain-driven and lazy-loaded via `React.lazy`. `RootRouter` enforces `requiresAuth` and `permission` fields.
    - Domain modules are under `src/modules/<domain>/` and follow a consistent layout: `components/`, `queries/`, `types.ts`, `constants.ts`, `hooks/`.

- UI patterns:

    - **Button with Link**: Use the `render` prop pattern from base-ui: `<Button render={<Link to="/path" />}>`.
    - **Select elements**: Use native `<select>` / `<option>` with Tailwind classes for form selects.
    - **Textarea**: Use native `<textarea>` with Tailwind classes.
    - **Chips/Tags**: Use shadcn `Badge` component.
    - **Dividers**: Use shadcn `Separator` component.
    - **Modals/Dialogs**: Use the custom `Modal` wrapper (shadcn Dialog-based) in `src/modules/shared/components/Modal`.
    - **Icons**: Import directly from `lucide-react`.
    - **Responsive breakpoints**: Use custom hooks (`useIsMobile`, `useIsSmallMobile`, `useIsCompact`, `useIsTablet`) from `src/hooks/useBreakpoint.ts`.
    - **Brand colors**: Tailwind tokens — `primary-brand`, `accent-brand`, `danger-brand`, `info-brand`, `warning-brand`, `success-brand`, `dark`, `border-brand`, `bg-brand`, `paper`, `text-body`, `text-light`.

- API and networking conventions:

    - Centralized endpoints in `src/api.ts`. Use `buildQuery` (`src/helpers/buildQuery.ts`) for query string generation.
    - REST API helpers return full URLs (e.g. `url.chat.connect(options)`), and websocket endpoints use `VITE_BASE_WS_URL`.
    - Auth tokens: login stores `token` and `jwt_type` in cookies (`js-cookie`). `AuthProvider` (`src/modules/auth/components/AuthProvider`) reads the cookie and uses react-query to fetch `user` data.
    - Websockets: check `src/modules/chat` for websocket usage; `react-use-websocket` is a dependency.

- Patterns to follow when adding features:

    - Add domain logic under `src/modules/<domain>` following existing folders (`components`, `queries`, `types.ts`, `constants.ts`).
    - Place API call implementations as small functions in `queries/` and reference endpoint URLs from `src/api.ts`.
    - Types live in `types.ts` inside each module and are imported by components/queries.
    - UI components are functional React components with TypeScript props. Use shadcn/ui components and Tailwind CSS for all styling.
    - Use `cn()` from `src/lib/utils.ts` for conditional class merging.
    - Forms use Formik + Yup for state management and validation. Use the form wrappers in `src/components/form/` for Formik-integrated inputs.

- Permissions & routing:

    - Routes declare `permission` (from `src/modules/shared/constants.ts`) and `requiresAuth`. `RootRouter` uses `useUser()` and `usePermissions()` to decide render vs redirect to login or 404.

- Testing & CI:

    - There are no test scripts in `package.json`. Keep changes small and rely on local `dev` and `build` for verification.

- Formatting & linting:

    - `prettier` + `eslint` enforced via `lint-staged` and `husky` pre-commit hook. Run `npm run lint` locally before commits.
    - `prettier-plugin-tailwindcss` is installed for automatic class sorting.

- Useful files to inspect when debugging or changing behavior:
    - `src/App.tsx` — global providers and analytics bootstrapping.
    - `src/api.ts` — canonical place for endpoints and websocket URLs.
    - `src/main.css` — Tailwind theme configuration and shadcn/ui semantic tokens.
    - `src/modules/shared/routes.tsx` — application routes and permission patterns.
    - `src/modules/auth` — login/register flows and `AuthProvider` logic.
    - `src/helpers/buildQuery.ts` — canonical query-string builder used across the repo.
    - `src/components/ui/` — shadcn/ui component library.
    - `src/components/form/` — Formik-integrated form input wrappers.
    - `src/hooks/useBreakpoint.ts` — responsive breakpoint hooks.

If anything here is unclear or you want me to expand examples (e.g. a sample `queries/` file or a checklist for adding a new route/module), tell me which section to expand and I will update this file.
