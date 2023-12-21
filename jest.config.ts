const nextJest = require("next/jest");
import type { Config } from "jest";
import { defaults } from "jest-config";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config: Config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  preset: "ts-jest",

  transform: { "^.+\\.ts?$": "ts-jest" },

  testEnvironment: "node",

  testRegex: ".*\\.(test|spec)?\\.(ts|tsx)$",

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  transformIgnorePatterns: ["/node_modules/(?!@byte-this)"],
  bail: 1,
  verbose: true,
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
