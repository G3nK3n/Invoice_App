import '@testing-library/jest-dom/jest-globals';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

// Mock next/font/google to avoid errors in Jest
jest.mock('next/font/google', () => ({
    League_Spartan: jest.fn(() => ({
        className: 'mock-league-spartan',
        style: { fontFamily: 'Mock League Spartan' },
    })),
}));