import axios from "axios";

import { API_BASE_URL } from "@/constants/config";

import type { AxiosError, InternalAxiosRequestConfig } from "axios";

// Main axios instance: used by all API
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
});

// Separate instance for token refresh — no interceptors = no infinite loop
export const refreshAxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
});

// --- Token refresh logic ---
// This is adapted from common patterns for handling token refresh with axios interceptors.

interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((item) => {
    if (token) {
      item.resolve(token);
    } else {
      item.reject(error);
    }
  });
  failedQueue = [];
};

// Using require to avoid circular imports (auth-store imports Orval → imports custom-instance → imports this)
const getAuthStore = () => require("../stores/auth-store").useAuthStore;

const safeLogout = () => {
  try {
    getAuthStore().getState().logout();
  } catch (error) {
    if (__DEV__) {
      console.warn("Auth store not available for logout:", error);
    }
  }
};

// --- Request interceptor ---
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      const { accessToken } = getAuthStore().getState();
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (error) {
      if (__DEV__) {
        console.warn("Auth store not available for request interceptor:", error);
      }
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// --- Response interceptor: handle 401 + token refresh ---
interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableAxiosRequestConfig | undefined;

    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Already retried with a fresh token — token refresh worked but server
    // still rejects. Something is fundamentally wrong, force logout.
    if (originalRequest._retry) {
      safeLogout();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // If a refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return axiosInstance(originalRequest);
      });
    }

    isRefreshing = true;

    try {
      const authStore = getAuthStore();
      const { refreshToken, accessToken } = authStore.getState();

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      // Use the refresh instance to avoid infinite loop.
      // The backend requires a valid Bearer token even on the refresh endpoint.
      const { data } = await refreshAxiosInstance.post<{
        access_token: string;
      }>(
        "/auth/refresh-token",
        { token: refreshToken },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      // Refresh endpoint returns snake_case — normalize
      const newAccessToken = data.access_token;
      authStore.getState().setTokens(newAccessToken, refreshToken);

      processQueue(null, newAccessToken);

      // Retry the original request with the new token
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      }
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      safeLogout();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
