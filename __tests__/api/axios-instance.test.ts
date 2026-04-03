/**
 * @jest-environment node
 */
import { http, HttpResponse } from "msw";

// Mock toast
jest.mock("@/utils/toast");

const API = "https://frontend-test-be.stage.thinkeasy.cz";

// Build a real JWT for jwtDecode
function makeJwt(payload: Record<string, unknown>): string {
  const header = { alg: "HS256", typ: "JWT" };
  const encode = (obj: Record<string, unknown>) =>
    Buffer.from(JSON.stringify(obj)).toString("base64url");
  return `${encode(header)}.${encode(payload)}.fake-sig`;
}

const mockAccessToken = makeJwt({
  sub: "user-123",
  exp: Math.floor(Date.now() / 1000) + 3600,
});
const mockRefreshToken = "mock-refresh-token";

// Use the global MSW server from jest.setup.ts
import { server } from "../mocks/server";

function getModules() {
  const { useAuthStore } = require("@/stores/auth-store");
  const { axiosInstance } = require("@/api/axios-instance");
  return { useAuthStore, axiosInstance };
}

beforeEach(() => {
  const { useAuthStore } = getModules();
  useAuthStore.setState({
    accessToken: null,
    refreshToken: null,
    userId: null,
    isLoading: false,
    isHydrated: false,
  });
});

describe("axios-instance", () => {
  describe("request interceptor", () => {
    it("attaches Authorization header when token exists", async () => {
      const { useAuthStore, axiosInstance } = getModules();
      useAuthStore.setState({ accessToken: "test-token-123" });

      let capturedAuth: string | null = null;
      server.use(
        http.get(`${API}/posts`, ({ request }) => {
          capturedAuth = request.headers.get("Authorization");
          return HttpResponse.json([]);
        }),
      );

      await axiosInstance.get("/posts");
      expect(capturedAuth).toBe("Bearer test-token-123");
    });

    it("omits Authorization header when no token", async () => {
      const { axiosInstance } = getModules();

      let capturedAuth: string | null = null;
      server.use(
        http.get(`${API}/posts`, ({ request }) => {
          capturedAuth = request.headers.get("Authorization");
          return HttpResponse.json([]);
        }),
      );

      await axiosInstance.get("/posts");
      expect(capturedAuth).toBeNull();
    });
  });

  describe("response interceptor (401 handling)", () => {
    it("retries request after successful token refresh", async () => {
      const { useAuthStore, axiosInstance } = getModules();
      useAuthStore.setState({
        accessToken: "expired-token",
        refreshToken: mockRefreshToken,
      });

      let callCount = 0;
      server.use(
        http.get(`${API}/posts`, () => {
          callCount++;
          if (callCount === 1) {
            return HttpResponse.json(
              { message: "Unauthorized" },
              { status: 401 },
            );
          }
          return HttpResponse.json([{ id: "post-1" }]);
        }),
        http.post(`${API}/auth/refresh-token`, () =>
          HttpResponse.json({ access_token: mockAccessToken }),
        ),
      );

      const response = await axiosInstance.get("/posts");
      expect(callCount).toBe(2);
      expect(response.data).toEqual([{ id: "post-1" }]);
    });

    it("logs out when refresh fails", async () => {
      const { useAuthStore, axiosInstance } = getModules();
      useAuthStore.setState({
        accessToken: "expired-token",
        refreshToken: "bad-refresh",
      });

      server.use(
        http.get(`${API}/posts`, () =>
          HttpResponse.json({ message: "Unauthorized" }, { status: 401 }),
        ),
        http.post(`${API}/auth/refresh-token`, () =>
          HttpResponse.json({ message: "Invalid" }, { status: 401 }),
        ),
      );

      await expect(axiosInstance.get("/posts")).rejects.toThrow();
      expect(useAuthStore.getState().accessToken).toBeNull();
    });
  });
});
