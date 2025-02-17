import { gql } from '@apollo/client'

export const GET_ALL_INVOICES = gql`
    query GetAllInvoices {
        getAllInvoices {
            ClientName
            StatusName
            InvoiceID
        }
    }
`;
