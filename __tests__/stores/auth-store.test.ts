// Mock toast before importing the store
jest.mock("@/utils/toast");

// Mock Orval-generated auth functions — no real HTTP
jest.mock("@/api/generated/auth/auth", () => ({
  authControllerLogin: jest.fn(),
  authControllerSignup: jest.fn(),
}));

// Mock the refreshAxiosInstance used by refreshAccessToken
jest.mock("@/api/axios-instance", () => ({
  axiosInstance: { interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } } },
  refreshAxiosInstance: { post: jest.fn() },
}));

import { useAuthStore } from "@/stores/auth-store";
import { showErrorToast } from "@/utils/toast";
import {
  authControllerLogin,
  authControllerSignup,
} from "@/api/generated/auth/auth";
import { refreshAxiosInstance } from "@/api/axios-instance";

const mockedLogin = authControllerLogin as jest.MockedFunction<
  typeof authControllerLogin
>;
const mockedSignup = authControllerSignup as jest.MockedFunction<
  typeof authControllerSignup
>;
const mockedRefreshPost = (refreshAxiosInstance as unknown as { post: jest.Mock })
  .post;

// A real JWT that jwtDecode can parse
function makeJwt(payload: Record<string, unknown>): string {
  const header = { alg: "HS256", typ: "JWT" };
  const encode = (obj: Record<string, unknown>) =>
    Buffer.from(JSON.stringify(obj)).toString("base64url");
  return `${encode(header)}.${encode(payload)}.fake-sig`;
}

const mockUserId = "user-123";
const mockAccessToken = makeJwt({
  sub: mockUserId,
  exp: Math.floor(Date.now() / 1000) + 3600,
});
const mockRefreshToken = "mock-refresh-token";

const initialState = {
  accessToken: null,
  refreshToken: null,
  userId: null,
  isLoading: false,
  isHydrated: false,
};

beforeEach(() => {
  useAuthStore.setState(initialState);
  jest.clearAllMocks();
});

describe("auth-store", () => {
  describe("login", () => {
    it("sets tokens and userId on success", async () => {
      mockedLogin.mockResolvedValueOnce({
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
      });

      await useAuthStore.getState().login("test@example.com", "password123");

      const state = useAuthStore.getState();
      expect(state.accessToken).toBe(mockAccessToken);
      expect(state.refreshToken).toBe(mockRefreshToken);
      expect(state.userId).toBe(mockUserId);
    });

    it("shows error toast and throws on failure", async () => {
      const axiosError = Object.assign(new Error("Request failed"), {
        isAxiosError: true,
        response: { status: 401, data: { message: "Invalid credentials" } },
      });
      mockedLogin.mockRejectedValueOnce(axiosError);

      await expect(
        useAuthStore.getState().login("bad@example.com", "wrong"),
      ).rejects.toThrow();

      expect(showErrorToast).toHaveBeenCalledWith("Invalid credentials");
      expect(useAuthStore.getState().accessToken).toBeNull();
    });

    it("sets isLoading during the request", async () => {
      let resolveLogin!: (value: { accessToken: string; refreshToken: string }) => void;
      mockedLogin.mockReturnValueOnce(
        new Promise((resolve) => {
          resolveLogin = resolve;
        }),
      );

      const promise = useAuthStore
        .getState()
        .login("test@example.com", "pass");
      expect(useAuthStore.getState().isLoading).toBe(true);

      resolveLogin({
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
      });
      await promise;
      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  describe("signup", () => {
    it("sets tokens and userId on success", async () => {
      mockedSignup.mockResolvedValueOnce({
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
      });

      await useAuthStore.getState().signup({
        email: "new@example.com",
        password: "password123",
        firstname: "Test",
        lastname: "User",
      });

      const state = useAuthStore.getState();
      expect(state.accessToken).toBe(mockAccessToken);
      expect(state.refreshToken).toBe(mockRefreshToken);
      expect(state.userId).toBe(mockUserId);
    });

    it("shows error toast and throws on failure", async () => {
      const axiosError = Object.assign(new Error("Request failed"), {
        isAxiosError: true,
        response: { status: 409, data: { message: "Email already in use" } },
      });
      mockedSignup.mockRejectedValueOnce(axiosError);

      await expect(
        useAuthStore.getState().signup({
          email: "exists@example.com",
          password: "password123",
          firstname: "Test",
          lastname: "User",
        }),
      ).rejects.toThrow();

      expect(showErrorToast).toHaveBeenCalledWith("Email already in use");
    });
  });

  describe("logout", () => {
    it("clears all auth state", () => {
      useAuthStore.setState({
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
        userId: mockUserId,
      });

      useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.userId).toBeNull();
    });
  });

  describe("refreshAccessToken", () => {
    it("updates accessToken on success", async () => {
      useAuthStore.setState({
        accessToken: "old-token",
        refreshToken: mockRefreshToken,
      });

      mockedRefreshPost.mockResolvedValueOnce({
        data: { access_token: mockAccessToken },
      });

      const newToken = await useAuthStore.getState().refreshAccessToken();

      expect(newToken).toBe(mockAccessToken);
      expect(useAuthStore.getState().accessToken).toBe(mockAccessToken);
      expect(mockedRefreshPost).toHaveBeenCalledWith("/auth/refresh-token", {
        token: mockRefreshToken,
      });
    });

    it("logs out and shows toast when refresh fails", async () => {
      useAuthStore.setState({
        accessToken: "old-token",
        refreshToken: "expired-refresh",
      });

      mockedRefreshPost.mockRejectedValueOnce(new Error("Refresh failed"));

      const result = await useAuthStore.getState().refreshAccessToken();

      expect(result).toBeNull();
      expect(useAuthStore.getState().accessToken).toBeNull();
      expect(showErrorToast).toHaveBeenCalledWith(
        "Session expired. Please log in again.",
      );
    });

    it("logs out when no refresh token available", async () => {
      useAuthStore.setState({ refreshToken: null });

      const result = await useAuthStore.getState().refreshAccessToken();

      expect(result).toBeNull();
      expect(useAuthStore.getState().accessToken).toBeNull();
    });
  });
});
