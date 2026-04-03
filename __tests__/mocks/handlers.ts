import { http, HttpResponse } from "msw";

const API = process.env.EXPO_PUBLIC_API_URL!;

// Build a real base64url-encoded JWT so jwtDecode can parse it
function makeJwt(payload: Record<string, unknown>): string {
  const header = { alg: "HS256", typ: "JWT" };
  const encode = (obj: Record<string, unknown>) =>
    Buffer.from(JSON.stringify(obj))
      .toString("base64url");
  return `${encode(header)}.${encode(payload)}.fake-signature`;
}

export const mockUserId = "user-123";

export const mockAccessToken = makeJwt({
  sub: mockUserId,
  exp: Math.floor(Date.now() / 1000) + 3600,
  iat: Math.floor(Date.now() / 1000),
});

export const mockRefreshToken = "mock-refresh-token";

export const mockPosts = [
  {
    id: "post-1",
    createdAt: "2026-01-15T10:00:00.000Z",
    updatedAt: "2026-01-15T10:00:00.000Z",
    title: "First Post",
    content: "This is the content of the first post",
    published: true,
    authorId: mockUserId,
  },
  {
    id: "post-2",
    createdAt: "2026-01-16T12:00:00.000Z",
    updatedAt: "2026-01-16T12:00:00.000Z",
    title: "Second Post",
    content: "This is the content of the second post",
    published: true,
    authorId: "user-456",
  },
];

export const handlers = [
  // Auth: Login
  http.post(`${API}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    if (body.email === "bad@example.com") {
      return HttpResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }
    return HttpResponse.json({
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken,
    });
  }),

  // Auth: Signup
  http.post(`${API}/auth/signup`, async ({ request }) => {
    const body = (await request.json()) as { email: string };
    if (body.email === "exists@example.com") {
      return HttpResponse.json(
        { message: "Email already in use" },
        { status: 409 },
      );
    }
    return HttpResponse.json({
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken,
    });
  }),

  // Auth: Refresh token
  http.post(`${API}/auth/refresh-token`, () => {
    return HttpResponse.json({ access_token: mockAccessToken });
  }),

  // Posts: Get all
  http.get(`${API}/posts`, () => {
    return HttpResponse.json(mockPosts);
  }),

  // Posts: Get by user
  http.get(`${API}/posts/user/:userId`, ({ params }) => {
    const { userId } = params;
    const userPosts = mockPosts.filter((p) => p.authorId === userId);
    return HttpResponse.json(userPosts);
  }),

  // Posts: Get by ID
  http.get(`${API}/posts/:postId`, ({ params }) => {
    const { postId } = params;
    const post = mockPosts.find((p) => p.id === postId);
    if (!post) {
      return HttpResponse.json({ message: "Post not found" }, { status: 404 });
    }
    return HttpResponse.json(post);
  }),

  // Posts: Create
  http.post(`${API}/posts`, async ({ request }) => {
    const body = (await request.json()) as {
      title: string;
      content: string;
    };
    return HttpResponse.json({
      title: body.title,
      content: { text: body.content },
      published: true,
      author: { id: mockUserId },
    });
  }),
];
