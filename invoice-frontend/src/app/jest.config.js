module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/app/setupTests.ts'], // Ensure setupTests.ts exists
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest', // Handles TypeScript files
        '^.+\\.(js|jsx)$': 'babel-jest', // Handles JavaScript/JSX files
    },
    testMatch: [
        "**/src/app/jest/**/*.[jt]s?(x)",  // Looks for test files in src/app/jest/testfiles/
        "**/jest/**/*.[jt]s?(x)"                    // Optionally looks inside jest/
    ],
};