# Chunk 7: Polish, Error Handling & Tests — Implementation Plan

## Overview

This plan covers two parts:
- **7A**: Error Handling & Loading Polish (4 mandatory tasks + 1 optional)
- **7B**: Tests (7 test files + 2 config files + 2 mock infrastructure files)

All file paths are absolute, rooted at `/Users/jancik/Programming/JOBS/miniApp`.

---

## Part 7A: Error Handling & Loading Polish

### Task 7A-1: Create `src/utils/errors.ts`

**File**: `/Users/jancik/Programming/JOBS/miniApp/src/utils/errors.ts`

**Purpose**: Centralized error message extraction utility that handles AxiosError, generic Error, and unknown values.

**Implementation**: Export a single function `getErrorMessage(error: unknown): string` with this priority chain:

1. Check if error is an AxiosError (via `isAxiosError` property duck-typing, not `instanceof`)
2. If AxiosError with no `.response` (network error) -> return `"No internet connection"`
3. If AxiosError with `.response.data.message` (string) -> return that string
4. If AxiosError with `.response.data.error` (string) -> return that string
5. Fall back to status code mapping:
   - 400 -> `"Invalid request. Please check your input."`
   - 401 -> `"Session expired. Please log in again."`
   - 403 -> `"You don't have permission to do that."`
   - 404 -> `"The requested resource was not found."`
   - 409 -> `"This resource already exists."`
   - 422 -> `"Invalid data. Please check your input."`
   - 429 -> `"Too many requests. Please try again later."`
   - 5xx -> `"Something went wrong, please try again."`
   - other -> `"Something went wrong."`
6. If plain Error -> return `error.message`
7. If unknown -> return `"Something went wrong."`

**Key design decisions**:
- Uses duck-typing (`isAxiosError` property check) rather than `instanceof AxiosError` to avoid import issues.
- Checks `data.message` first, then `data.error` — matches NestJS error response shapes.
- The 409 case handles the signup "user already exists" scenario.
- Does NOT return raw Axios messages like "Request failed with status code 400".

Also export a private helper `isAxiosError(error: unknown): error is AxiosError<unknown>` that checks for `typeof error === "object" && error !== null && "isAxiosError" in error && error.isAxiosError === true`.

---

### Task 7A-2: Update auth store error handling

**File**: `/Users/jancik/Programming/JOBS/miniApp/src/stores/auth-store.ts`

**Changes**:
- Add import: `import { getErrorMessage } from "@/utils/errors";`
- Line 74-76 (login catch): Replace `const message = error instanceof Error ? error.message : "Login failed"; showErrorToast(message);` with `showErrorToast(getErrorMessage(error));`
- Line 89-91 (signup catch): Replace `const message = error instanceof Error ? error.message : "Signup failed"; showErrorToast(message);` with `showErrorToast(getErrorMessage(error));`

**Do NOT change**: The `refreshAccessToken` catch block (line 123) which has a hardcoded "Session expired. Please log in again." — this is intentional since refresh failures always mean the same thing.

**What this fixes**: If login returns 400 with `{ "message": "Invalid credentials" }`, users currently see "Request failed with status code 400". After this change, they see "Invalid credentials".

---

### Task 7A-3: Update global mutation onError in root layout

**File**: `/Users/jancik/Programming/JOBS/miniApp/app/_layout.tsx`

**Changes**:
- Add import: `import { getErrorMessage } from "@/utils/errors";`
- Lines 21-24: Replace the mutation `onError` handler body with: `showErrorToast(getErrorMessage(error));`

**What this fixes**: The global mutation error handler (used for `useCreatePost`) now extracts server error messages instead of showing raw Axios error text.

---

### Task 7A-4: Wrap Create Post screen in ErrorBoundary

**File**: `/Users/jancik/Programming/JOBS/miniApp/app/(app)/create.tsx`

**Changes**:
- Add import: `import ErrorBoundary from "@/components/ErrorBoundary";`
- Wrap the returned `<KeyboardAvoidingView>` in `<ErrorBoundary>...</ErrorBoundary>`

This makes the Create screen consistent with Feed, Profile, and Post Detail screens.

---

### Task 7A-5 (Optional): Wrap auth screens in ErrorBoundary

**Files**:
- `/Users/jancik/Programming/JOBS/miniApp/app/(auth)/login.tsx`
- `/Users/jancik/Programming/JOBS/miniApp/app/(auth)/signup.tsx`

Same pattern as 7A-4. Low priority since auth screens have try/catch already.

---

### 7A File Changes Summary

| File | Change | Description |
|------|--------|-------------|
| `src/utils/errors.ts` | NEW | `getErrorMessage()` utility |
| `src/stores/auth-store.ts` | MODIFY | Use `getErrorMessage()` in login/signup catch |
| `app/_layout.tsx` | MODIFY | Use `getErrorMessage()` in mutation onError |
| `app/(app)/create.tsx` | MODIFY | Wrap in ErrorBoundary |
| `app/(auth)/login.tsx` | MODIFY (optional) | Wrap in ErrorBoundary |
| `app/(auth)/signup.tsx` | MODIFY (optional) | Wrap in ErrorBoundary |

**Order**: 7A-1 first, then 7A-2 through 7A-5 in any order.

---

## Part 7B: Tests

### Task 7B-1: Jest Configuration

**File**: `/Users/jancik/Programming/JOBS/miniApp/jest.config.ts`

**Content outline**:
- `preset: "jest-expo"` — inherits transform, transformIgnorePatterns, setupFiles from jest-expo
- `setupFilesAfterSetup: ["./jest.setup.ts"]` — runs after test framework is installed
- `moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" }` — maps the `@/*` path alias

**CRITICAL GOTCHA — config key name**: The Jest config key for setup files that run after the test framework is installed is `setupFilesAfterSetup`. Verify against the `Config` type from `jest` — TypeScript will catch a misspelling.

**Do NOT add**:
- Custom `transformIgnorePatterns` — would OVERRIDE the preset's comprehensive array (Jest arrays don't merge), breaking Expo/RN module transforms
- Custom `transform` — jest-expo already sets up babel-jest with Metro config

---

### Task 7B-2: Jest Setup File

**File**: `/Users/jancik/Programming/JOBS/miniApp/jest.setup.ts`

**Content outline** (in order):

1. Set `process.env.EXPO_PUBLIC_API_URL` at the very top (before any module that imports `config.ts`):
   ```
   process.env.EXPO_PUBLIC_API_URL = "https://frontend-test-be.stage.thinkeasy.cz";
   ```

2. Import matchers: `import "@testing-library/react-native/build/matchers/extend-expect";`
   This gives `toBeOnTheScreen`, `toHaveTextContent`, `toBeDisabled`, `toBeVisible`, `toHaveProp`, `toHaveStyle`, etc. No `@testing-library/jest-native` needed.

3. Mock AsyncStorage:
   ```
   jest.mock("@react-native-async-storage/async-storage", () =>
     require("@react-native-async-storage/async-storage/jest/async-storage-mock")
   );
   ```

4. Mock expo-splash-screen (root layout calls preventAutoHideAsync at module load):
   ```
   jest.mock("expo-splash-screen", () => ({
     preventAutoHideAsync: jest.fn(() => Promise.resolve()),
     hideAsync: jest.fn(() => Promise.resolve()),
   }));
   ```

5. Guard `__DEV__` global (should already be set by jest-expo, but be safe):
   ```
   if (typeof globalThis.__DEV__ === "undefined") {
     (globalThis as Record<string, unknown>).__DEV__ = true;
   }
   ```

6. MSW server lifecycle:
   ```
   import { server } from "./__tests__/mocks/server";
   beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
   afterEach(() => server.resetHandlers());
   afterAll(() => server.close());
   ```

---

### Task 7B-3: MSW Handlers and Server

**File**: `/Users/jancik/Programming/JOBS/miniApp/__tests__/mocks/handlers.ts`

Uses MSW v2 syntax: `http.post()`, `http.get()`, `HttpResponse.json()`.

**Exports**:
- `mockAccessToken` — a valid 3-segment JWT string with payload `{ sub: "user-123", exp: 9999999999 }`. Must be base64url-encoded so `jwtDecode` can parse it. Generate with:
  ```
  btoa('{"alg":"HS256","typ":"JWT"}') + "." + btoa('{"sub":"user-123","exp":9999999999,"iat":1700000000}') + ".test-sig"
  ```
  Then replace `+` with `-`, `/` with `_`, remove trailing `=`.

- `mockRefreshToken` — plain string `"mock-refresh-token"`

- `mockPosts` — array of 2 PostResponse objects with different authorIds

- `handlers` — array of MSW handler definitions:
  - `POST /auth/login` — returns `{ accessToken, refreshToken }`. If email is `"bad@example.com"`, returns 401 with `{ message: "Invalid credentials" }`.
  - `POST /auth/signup` — returns `{ accessToken, refreshToken }`. If email is `"existing@example.com"`, returns 409 with `{ message: "User already exists" }`.
  - `POST /auth/refresh-token` — returns `{ access_token: mockAccessToken }` (snake_case).
  - `GET /posts` — returns `mockPosts`.
  - `GET /posts/user/:userId` — returns filtered `mockPosts` by authorId.
  - `GET /posts/:postId` — returns single post or 404.
  - `POST /posts` — returns PostResponce shape.

**CRITICAL**: Base URL must be `"https://frontend-test-be.stage.thinkeasy.cz"` to match what `axiosInstance` uses.

**File**: `/Users/jancik/Programming/JOBS/miniApp/__tests__/mocks/server.ts`

```
import { setupServer } from "msw/node";
import { handlers } from "./handlers";
export const server = setupServer(...handlers);
```

Uses `msw/node` (Node.js HTTP interception), NOT `msw/native` or `msw/browser`.

---

### Task 7B-4: Auth Store Tests (HIGHEST PRIORITY)

**File**: `/Users/jancik/Programming/JOBS/miniApp/__tests__/stores/auth-store.test.ts`

**Setup pattern**:
```
import { useAuthStore } from "@/stores/auth-store";

// Mock toast to suppress and assert
jest.mock("@/utils/toast", () => ({
  showSuccessToast: jest.fn(),
  showErrorToast: jest.fn(),
}));

beforeEach(() => {
  useAuthStore.setState({
    accessToken: null, refreshToken: null, userId: null,
    isLoading: false, isHydrated: true,
  });
});
```

**Test cases** (8 tests):
1. `login` success: sets accessToken, refreshToken, userId (extracted from JWT sub)
2. `login` failure: tokens remain null, `showErrorToast` called with server message
3. `signup` success: sets tokens and userId
4. `signup` failure (409): tokens remain null, toast shown
5. `logout`: clears accessToken, refreshToken, userId to null
6. `refreshAccessToken` success: updates accessToken
7. `refreshAccessToken` failure (no refresh token): returns null, calls logout
8. `refreshAccessToken` failure (server rejects): use `server.use()` to override handler, returns null, calls logout

**Key gotcha — Zustand singleton**: Reset state in `beforeEach` using `useAuthStore.setState(...)`.

**Key gotcha — async throw**: `login`/`signup` throw on failure (re-throw after toast). Test with:
```
await expect(useAuthStore.getState().login("bad@example.com", "x")).rejects.toThrow();
```

**Key gotcha — error message assertion**: After 7A-2, the toast will show the server's error message. Import the mocked `showErrorToast` and assert:
```
import { showErrorToast } from "@/utils/toast";
expect(showErrorToast).toHaveBeenCalledWith("Invalid credentials");
```

---

### Task 7B-5: Axios Instance Tests

**File**: `/Users/jancik/Programming/JOBS/miniApp/__tests__/api/axios-instance.test.ts`

**Test cases** (5 tests):
1. Request interceptor attaches Bearer token from store
2. Request interceptor handles missing token gracefully
3. 401 response triggers refresh and retries original request
4. Failed refresh triggers logout
5. Concurrent 401s: only one refresh call, others queue and all retry

**Key implementation notes**:

- Module-level state (`isRefreshing`, `failedQueue`) persists between tests. Structure tests so each completes its cycle, or use `jest.resetModules()` + re-require pattern.

- Track refresh calls via a counter variable in `server.use()` overrides.

- For test 3 (401 triggers refresh): Make the first call to a `GET /posts` endpoint return 401, have the refresh handler return success, then verify the GET request was retried (returns 200 data).

- For test 5 (concurrent 401s): Fire 3 `axiosInstance.get(...)` calls simultaneously with `Promise.all()`. All return 401 initially. Assert `refreshCallCount === 1` and all 3 promises resolve successfully.

- Set auth store state before each test:
  ```
  useAuthStore.setState({ accessToken: "old-token", refreshToken: "valid-refresh" });
  ```

---

### Task 7B-6: Component Tests

#### PostCard Test
**File**: `/Users/jancik/Programming/JOBS/miniApp/__tests__/components/PostCard.test.tsx`

5 test cases: renders title, renders content, renders date, renders author ID prefix, calls onPress.

Uses `render`, `screen`, `fireEvent` from `@testing-library/react-native`. No providers needed — pure presentational component.

#### PostList Test
**File**: `/Users/jancik/Programming/JOBS/miniApp/__tests__/components/PostList.test.tsx`

5 test cases: renders post cards, shows skeletons when loading, shows empty message, shows custom empty message, calls onPostPress with correct post.

Note: FlatList rendering works with `@testing-library/react-native` out of the box.

#### SearchBar Test
**File**: `/Users/jancik/Programming/JOBS/miniApp/__tests__/components/SearchBar.test.tsx`

6 test cases: renders input with placeholder, shows value, calls onChangeText, shows clear button when value present, hides clear button when empty, calls onClear.

May need Ionicons mock if jest-expo does not handle `@expo/vector-icons`:
```
jest.mock("@expo/vector-icons", () => ({ Ionicons: "Ionicons" }));
```

---

### Task 7B-7: Hook Tests

**File**: `/Users/jancik/Programming/JOBS/miniApp/__tests__/hooks/useSearch.test.ts`

5 test cases: initial empty state, immediate searchQuery update, debouncedQuery after delay, clearSearch resets both, rapid calls produce single debounced update.

Uses `renderHook` + `act` from `@testing-library/react-native` (v13 includes renderHook natively). Uses `jest.useFakeTimers()` and `jest.advanceTimersByTime(300)`.

---

### Task 7B-8: Error Utility Tests

**File**: `/Users/jancik/Programming/JOBS/miniApp/__tests__/utils/errors.test.ts`

9 test cases covering all branches of `getErrorMessage`:
- Network AxiosError (no response)
- AxiosError with `data.message`
- AxiosError with `data.error`
- AxiosError 401 (no message) -> status mapping
- AxiosError 500 -> status mapping
- AxiosError 400 (no message) -> status mapping
- AxiosError 409 -> status mapping
- Generic Error
- Unknown value (string, number, null)

Create mock AxiosError objects manually with `{ isAxiosError: true, response: { status, data } }`. No MSW or providers needed — pure function tests.

---

## Execution Order

### Phase 1: Error utility
Create `src/utils/errors.ts` (7A-1).

### Phase 2: Apply error handling
Update `src/stores/auth-store.ts` (7A-2), `app/_layout.tsx` (7A-3), `app/(app)/create.tsx` (7A-4).

### Phase 3: Test infrastructure
Create `jest.config.ts` (7B-1), `jest.setup.ts` (7B-2), `__tests__/mocks/handlers.ts` + `__tests__/mocks/server.ts` (7B-3). Create subdirectories: `__tests__/stores/`, `__tests__/api/`, `__tests__/components/`, `__tests__/hooks/`, `__tests__/utils/`.

### Phase 4: Write tests
1. `__tests__/utils/errors.test.ts` (7B-8) — fastest to verify, pure function
2. `__tests__/stores/auth-store.test.ts` (7B-4) — most critical
3. `__tests__/components/PostCard.test.tsx` (7B-6)
4. `__tests__/components/PostList.test.tsx` (7B-6)
5. `__tests__/components/SearchBar.test.tsx` (7B-6)
6. `__tests__/hooks/useSearch.test.ts` (7B-7)
7. `__tests__/api/axios-instance.test.ts` (7B-5) — most complex, do last

### Phase 5: Verify
- `npm test` -> all tests pass
- `npx tsc --noEmit` -> no type errors

---

## Additional Gotchas

### 1. EXPO_PUBLIC_API_URL in tests
`config.ts` reads `process.env.EXPO_PUBLIC_API_URL!`. In Jest, `.env` is NOT auto-loaded. Set it at the very top of `jest.setup.ts` before any imports that could trigger module evaluation.

### 2. NativeWind in tests
The NativeWind Babel preset is in `babel.config.js` and will be picked up by jest-expo's babel-jest transform. `className` props will be transformed to `style`. Should work transparently.

### 3. Zustand persist + AsyncStorage in tests
The auth store's persist middleware will read/write to the mocked AsyncStorage. The `onRehydrateStorage` callback fires asynchronously and sets `isHydrated: true`. In tests, set `isHydrated: true` manually in `beforeEach` to avoid timing issues.

### 4. Circular dependency chain
`auth-store -> generated/auth -> custom-instance -> axios-instance -> (lazy require) auth-store`. MSW intercepts at the HTTP level, so the full chain works in tests. No special handling needed.

### 5. react-native-toast-message in tests
If any test renders a component that includes `<Toast />`, mock the package:
```
jest.mock("react-native-toast-message", () => {
  const RN = require("react-native");
  return { __esModule: true, default: () => null, show: jest.fn(), hide: jest.fn() };
});
```

### 6. Mock JWT token validity
The `mockAccessToken` must be a real base64url-encoded 3-segment JWT for `jwtDecode` to parse it. Test the token with `jwtDecode(mockAccessToken)` in the handlers file or in a dedicated sanity check.
