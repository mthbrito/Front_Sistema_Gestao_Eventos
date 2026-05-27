module.exports = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["@testing-library/jest-dom"], // ← corrigido
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|less|scss)$": "<rootDir>/__mocks__/fileMock.cjs",
  },
};