import * as SecureStore from "expo-secure-store";

import type { StateStorage } from "zustand/middleware";

/**
 * Zustand-compatible storage adapter backed by expo-secure-store.
 *
 * expo-secure-store encrypts values at rest using the OS keychain (iOS)
 * or Android Keystore, making it suitable for persisting auth tokens.
 */
export const secureStorage: StateStorage = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};
