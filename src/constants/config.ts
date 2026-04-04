if (!process.env.EXPO_PUBLIC_API_URL) {
  throw new Error(
    "EXPO_PUBLIC_API_URL is not set. Copy .env.example to .env and fill in the values.",
  );
}

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
