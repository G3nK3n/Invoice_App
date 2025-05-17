import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { gql } from "@apollo/client";
import client from "../lib/apolloClient"; // Import Apollo Client

// GraphQL Query
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
`;

export const GET_SPECIFIC_INVOICE = gql`
    query ($id: Int!) {
        getInvoiceById(id: $id) {
            InvoiceID
            InvoiceDescription
            InvoiceCreateDate
            InvoicePaymentDue
            InvoicePaymentTerms
            ClientName
            ClientAddress
            ClientCity
            ClientPostalCode
            ClientCountry
            ClientEmail
            BillsFromAddress
            BillsFromCity
            BillsFromPostalCode
            BillsFromCountry
            InvoiceTotal
            StatusName
            Items {
                ItemID
                ItemName
                ItemPrice
                ItemQuantity
                ItemTotal
            }
        }
    }
`


// Async function to fetch data
export const fetchInvoices = createAsyncThunk("invoice/fetchInvoices", async () => {
    const { data } = await client.query({ query: GET_HOME_INVOICE });
    return data.getHomeInvoices;
});

export const getInvoiceById = createAsyncThunk(
    'invoice/getInvoiceById',
    async (theInvoiceID: number, { rejectWithValue }) => {
        try {
            const response = await fetch('http://localhost:5000/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    //Used .loc.source.body to make convert the query into a string
                    query: GET_SPECIFIC_INVOICE.loc?.source.body,
                    variables: { id: theInvoiceID }
                }),
            });

            const data = await response.json();

            if (data.errors) {
                throw new Error(data.errors[0].message);
            }

            return data.data.getInvoiceById;
        } catch (error) {

            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

            return rejectWithValue(errorMessage);
        }
    }
);

// Redux Slice
const invoiceSlice = createSlice({
    name: "invoice",
    initialState: { invoices: [], selectedInvoice: null, loading: false, error: "" },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInvoices.fulfilled, (state, action) => {
                state.loading = false;
                state.invoices = action.payload;
            })
            .addCase(fetchInvoices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Something went wrong";
            });

        builder
            .addCase(getInvoiceById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedInvoice = action.payload;
            })
            .addCase(getInvoiceById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Something went wrong";
            });
    },
});

export default invoiceSlice.reducer;