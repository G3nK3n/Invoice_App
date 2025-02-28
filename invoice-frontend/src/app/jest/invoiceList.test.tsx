/**
 * @jest-environment jsdom
 */

// src/components/__tests__/Invoice.test.tsx
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing'; // Apollo's test provider
import Invoice from '../Home/Invoice/Invoice'; // Path to your Invoice component
import { GET_HOME_INVOICE } from '../graphql/queries'; // Your GraphQL query file
import { describe, it, expect } from '@jest/globals';
import '@testing-library/jest-dom'; // Ensure matchers are loaded


jest.mock('next/font/google', () => ({
    League_Spartan: jest.fn(() => ({
        className: 'mock-league-spartan',
        style: { fontFamily: 'Mock League Spartan' },
    })),
}));

// Mock data to simulate GraphQL query response
const mocks = [
    {
        request: {
            query: GET_HOME_INVOICE,
        },
        result: {
            data: {
                getHomeInvoices: [
                    {
                        InvoiceID: 1,
                        InvoicePaymentDue: new Date(),
                        ClientName: 'Test Client',
                        StatusName: 'Paid',
                        InvoiceTotal: 150.0,
                    },
                ],
            },
        },
    },
];

describe('Home Invoice Component', () => {
    it('renders invoice details correctly', async () => {
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <Invoice homeInvoice={mocks[0].result.data.getHomeInvoices[0]} />
            </MockedProvider>
        );

        // Wait for the component to load the mock data
        expect(await screen.findByText('#1')).toBeInTheDocument(); // Check InvoiceID 
        expect(screen.getByText('Test Client')).toBeInTheDocument(); // Check ClientName
        expect(screen.getByText(/£150/i)).toBeInTheDocument(); // Check InvoiceTotal
        expect(screen.getByText('Paid')).toBeInTheDocument(); // Check StatusName
    });
});
