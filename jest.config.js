/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/*.test.ts', '**/*.spec.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
  coverageThresholds: {
    global: { branches: 70, functions: 70, lines: 70, statements: 70 },
  },
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
};
