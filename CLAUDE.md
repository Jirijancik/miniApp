# CLAUDE.md

## Project Overview

React Native (Expo SDK 55) mini app for viewing/creating posts with JWT auth.
Backend API: `https://frontend-test-be.stage.thinkeasy.cz`

## Tech Stack

- **Framework**: Expo SDK 55 + Expo Router (file-based routing)
- **Language**: TypeScript (strict)
- **State**: Zustand (with persist middleware for auth)
- **Forms**: react-hook-form + zod + @hookform/resolvers
- **API Client**: Orval-generated axios functions
- **HTTP**: Axios (interceptors for token refresh)
- **Styling**: NativeWind (Tailwind CSS for RN)
- **Toasts**: react-native-toast-message
- **Testing**: jest-expo + @testing-library/react-native + msw

## Commands

```bash
npx expo start            # Start dev server
npm run generate-api      # Regenerate Orval API client
npx tsc --noEmit          # Type check
npm test                  # Run tests
```

## Folder Structure

```
app/                      # Expo Router file-based routing
  _layout.tsx             # Root: providers, Toast, auth guard
  (auth)/                 # Unauthenticated screens
    login.tsx, signup.tsx
  (app)/                  # Protected screens (tab navigator)
    (home)/
      index.tsx           # All posts feed + search
      post/[id].tsx       # Post detail
    create.tsx            # Create post form
    profile.tsx           # User's posts + logout
src/
  api/
    generated/            # Orval output (committed, do not hand-edit)
    axios-instance.ts     # Axios + interceptors + token refresh
    custom-instance.ts    # Orval mutator wrapper
  stores/
    auth-store.ts         # Tokens, login/signup/logout/refresh
    posts-store.ts        # Posts, search, loading, errors
  components/
    ui/                   # Primitive components: Button, Input, Spinner, SkeletonCard
    PostCard.tsx, PostList.tsx, SearchBar.tsx, ErrorBoundary.tsx
  hooks/                  # useAuth.ts, usePosts.ts, useSearch.ts
  utils/                  # toast.ts, validation.ts
  constants/              # config.ts (API_BASE_URL)
__tests__/                # Mirrors src/ structure
```

## Architecture Rules

### Navigation
- Auth guard via `Stack.Protected` in root layout — no manual redirects
- Auth state change automatically switches between (auth) and (app) groups
- Splash screen held until Zustand auth store hydrates

### Token Refresh Pattern
- Request interceptor attaches `Bearer {token}` from Zustand store
- Response interceptor on 401: queue concurrent failed requests, refresh via a **separate plain axios instance** (no interceptors = no infinite loop), replay on success, logout on failure
- Refresh endpoint returns `access_token` (snake_case) — normalize to camelCase

### API Quirks
- `PostResponce` (create) vs `PostResponse` (GET) — different shapes from OpenAPI
- `access_token` (snake_case from refresh) vs `accessToken` (camelCase from login/signup)
- Auth endpoints marked as secured but must work without token
- No delete/update endpoints — never show those affordances in UI

---

## Backend Verification

When implementing or modifying API-related code, always verify against the live backend:
- **Swagger UI**: `https://frontend-test-be.stage.thinkeasy.cz/api`
- **OpenAPI 3.0 schema**: `https://frontend-test-be.stage.thinkeasy.cz/api-json`

Check endpoint shapes, request/response formats, and error responses to ensure the implementation matches the actual backend behavior.

---

## Code Standards

### SOLID Principles

**Single Responsibility**
- Each file has one reason to change. A store manages state, a component renders UI, a hook composes behavior.
- Stores do NOT render anything. Components do NOT call APIs directly — they go through stores or hooks.
- Keep Zustand stores flat: one store per domain (`auth-store`, `posts-store`). Don't nest unrelated concerns.

**Open/Closed**
- Components accept props for variation — don't modify a shared component to add screen-specific logic. Use composition instead.
- Extend behavior through hooks and wrapper components, not by adding flags to existing ones.

**Liskov Substitution**
- All UI components in `src/components/ui/` must work as drop-in replacements where their base RN equivalent works. `<Button>` must accept everything `<Pressable>` accepts that it wraps, `<Input>` must accept everything `<TextInput>` accepts that it wraps.

**Interface Segregation**
- Component props should be minimal. Don't pass entire store objects — pass only the data the component needs.
- Use Zustand selectors to subscribe to specific slices, not the entire store.

**Dependency Inversion**
- Screens depend on hooks/stores (abstractions), not on axios or Orval-generated functions directly.
- The axios custom instance is the only place that knows about HTTP details.
- Stores call Orval-generated functions. Screens call store actions. Never skip a layer.

### KISS — Keep It Simple

- No premature abstraction. Three similar lines of code beat an over-engineered helper used once.
- No wrapper components that just pass props through unchanged.
- No custom hooks that only call one Zustand selector — inline that selector.
- Prefer `FlatList` over building custom virtualization. Use RN primitives.
- Client-side search is simple `filter` + `includes` — no search libraries.
- No Redux, no React Query, no context providers for things Zustand handles.

### DRY — Don't Repeat Yourself

- Shared UI primitives live in `src/components/ui/`. If a pattern appears on 2+ screens, extract it.
- Zod schemas live in `src/utils/validation.ts` — shared between form validation and (if needed) API response validation.
- Toast helpers in `src/utils/toast.ts` — `showSuccessToast()` and `showErrorToast()` instead of repeating `Toast.show()` config.
- One `PostList` component used on both Feed and Profile screens (accepts `posts` as prop).
- One `Input` component with react-hook-form `Controller` integration — don't rewrite form bindings per screen.
- Error handling pattern: try/catch in store actions → set error state → show toast. Same pattern everywhere, but don't abstract the try/catch itself into a generic wrapper unless there are 5+ identical patterns.

---

## Coding Conventions

### TypeScript
- Strict mode. No `any` — use `unknown` and narrow.
- Prefer `interface` for object shapes, `type` for unions/intersections.
- Export types alongside their modules. Co-locate types with the code that uses them.
- Use Orval-generated types for API data — never redefine them manually.

### Naming
- Files: `kebab-case.ts` for modules, `PascalCase.tsx` for components.
- Components: PascalCase (`PostCard`, `SearchBar`).
- Hooks: `camelCase` starting with `use` (`useAuth`, `usePosts`, `useSearch`).
- Stores: `camelCase` starting with `use` (`useAuthStore`, `usePostsStore`).
- Zustand selectors: inline arrow functions or named selectors (`selectIsAuthenticated`).
- Constants: `UPPER_SNAKE_CASE` (`API_BASE_URL`).
- Zod schemas: `camelCase` ending with `Schema` (`loginSchema`, `signupSchema`).

### Components
- Functional components only. No class components except `ErrorBoundary`.
- Props interface defined above the component, co-located in the same file.
- Destructure props in the function signature.
- Use NativeWind `className` for styling — no `StyleSheet.create` unless NativeWind can't handle it.
- Keep components under ~100 lines. If longer, extract sub-components or hooks.

### State Management (Zustand)
- Use selectors to prevent unnecessary re-renders: `useAuthStore(state => state.accessToken)` not `useAuthStore()`.
- Use `getState()` for imperative access outside React (interceptors, store actions).
- Persist middleware only on auth store. Posts are transient — refetch on mount.
- Async actions live inside the store. Screens call `store.action()`, never raw API functions.

### Error Handling
- Form validation: zod schemas (layer 1)
- HTTP 401: axios interceptor handles silently (layer 2)
- Store actions: try/catch → `error` state + `showErrorToast()` (layer 3)
- Screen-level: display `error` from store if present (layer 4)
- Unexpected crashes: `ErrorBoundary` wrapper (layer 5)
- Never swallow errors silently. Always toast or display.

### Testing
- Test files mirror source: `__tests__/stores/auth-store.test.ts` for `src/stores/auth-store.ts`.
- Use MSW for API mocking — don't mock axios directly.
- Test behavior, not implementation. Assert on rendered output / state changes, not internal method calls.
- Store tests: call action → assert state. No spying on internal helpers.
- Component tests: render → interact → assert visible output.

---

## Do NOT

- Hand-edit files in `src/api/generated/` — they are Orval output. Regenerate with `npm run generate-api`.
- Add delete/update UI for posts — the API doesn't support it.
- Use React Context for state that Zustand manages.
- Import `axiosInstance` directly in screens — go through stores.
- Use the intercepted axios instance for the refresh call (infinite loop).
- Add pagination — the API doesn't support it.
- Install additional state management or data-fetching libraries.
