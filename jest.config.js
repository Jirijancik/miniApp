/** @type {import('jest').Config} */
module.exports = {
  preset: "jest-expo",
  setupFiles: ["./jest.env.js"],
  setupFilesAfterEnv: ["./jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^msw/node$": "<rootDir>/node_modules/msw/lib/node/index.js",
    "^msw$": "<rootDir>/node_modules/msw/lib/core/index.js",
    "expo/virtual/streams": "<rootDir>/__tests__/mocks/expo-streams-mock.js",
  },
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|msw|until-async)",
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/__tests__/mocks/",
  ],
};
