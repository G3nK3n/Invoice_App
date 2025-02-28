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

//FOR TESTING
export const GET_HOME_INVOICE = gql`
    query GetHomeInvoices {
        getHomeInvoices {
            InvoiceID
            InvoicePaymentDue
            ClientName
            StatusName
            InvoiceTotal
        }
    }
`