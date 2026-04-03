// Env vars are set in jest.env.js (setupFiles phase) before module evaluation.

import "@testing-library/react-native/build/matchers/extend-expect";

// Mock AsyncStorage
jest.mock(
  "@react-native-async-storage/async-storage",
  () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

// Mock expo-splash-screen
jest.mock("expo-splash-screen", () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

// MSW server lifecycle
import { server } from "./__tests__/mocks/server";

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
