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

// Async function to fetch data
export const fetchInvoices = createAsyncThunk("invoice/fetchInvoices", async () => {
    const { data } = await client.query({ query: GET_HOME_INVOICE });
    return data.getHomeInvoices;
});

// Redux Slice
const invoiceSlice = createSlice({
    name: "invoice",
    initialState: { invoices: [], loading: false, error: "" },
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
    },
});

export default invoiceSlice.reducer;