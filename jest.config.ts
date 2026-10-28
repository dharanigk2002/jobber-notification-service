import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  extensionsToTreatAsEsm: [".ts"],
  testEnvironment: "node",
  verbose: true,
  coverageDirectory: "coverage",
  collectCoverage: true,
  watchAll: false,
  maxWorkers: 1,
  forceExit: true,
  testPathIgnorePatterns: ["/node_modules"],
  detectOpenHandles: true,
  transform: {
    "^.+\\.ts?$": ["ts-jest", { useESM: true }],
  },
  moduleNameMapper: {
    "^((?:\\.\\.?|src)\\/.*)\\.js$": "$1",
  },
  testMatch: ["<rootDir>/src/**/test/*.ts"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/test/*.ts?(x)",
    "!**/node_modules/**",
  ],
  coverageThreshold: {
    global: {
      branches: 1,
      statements: 1,
      lines: 1,
      functions: 1,
    },
  },
  coverageReporters: ["text-summary", "lcov"],
};

export default config;
