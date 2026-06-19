import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment:  'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/app/layout.tsx',
  ],
  coverageThreshold: {
    global: {
      branches:   60,
      functions:  60,
      lines:      60,
      statements: 60,
    },
  },
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}', '<rootDir>/tests/**/*.test.{ts,tsx}'],
};

export default createJestConfig(config);
