import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { gql } from "@apollo/client";
import client from "../lib/apolloClient"; // Import Apollo Client

// --- define types ---
interface Invoice {
    InvoiceID: number,
    InvoicePaymentDue: Date,
    ClientName: string,
    StatusName: string,
    InvoiceTotal: number
}

interface InvoiceState {
    invoices: Invoice[];
    selectedInvoice: null;
    selectedUpdateInvoice: null; // better than []
    newInvoice: Invoice | null;
    deletingItem: any; // adjust if you have type
    markedPaid: any;   // adjust if you have type
    loading: boolean;
    error: string | null;
}

// --- initial state, typed properly ---
const initialState: InvoiceState = {
    invoices: [],
    selectedInvoice: null,
    selectedUpdateInvoice: null,
    newInvoice: null,
    deletingItem: null,
    markedPaid: null,
    loading: false,
    error: null,
};

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
            ClientID
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

export const ADD_INVOICE = gql`
    mutation AddNewInvoice($invoice: InvoiceDetailInput!) {
        addNewInvoice(invoice: $invoice) {
            InvoiceID
            InvoicePaymentDue
            ClientName
            StatusName
            InvoiceTotal
        }
    }
`;

export const UPDATE_INVOICE = gql`
    mutation UpdateInvoice($invoice: InvoiceDetailInput!) {
        updateInvoice(invoice: $invoice) {
            InvoiceID
            InvoicePaymentDue
            ClientName
            StatusName
            InvoiceTotal
        }
    }
`;

export const DELETE_ITEM = gql`
    mutation DeleteItem($item_id: Int!) {
        deleteItem(item_id: $item_id)
    }
`;

export const MARK_PAID = gql`
    mutation MarkInvoiceAsPaid($invoice_id: Int!) {
        markInvoiceAsPaid(invoice_id: $invoice_id)
    }
`;


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

export const addNewInvoice = createAsyncThunk(
    'invoice/addNewInvoice',
    async (invoice: any, { rejectWithValue }) => {
        try {
            const response = await fetch('http://localhost:5000/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: ADD_INVOICE.loc?.source.body,
                    variables: { invoice },
                }),
            });

            const data = await response.json();

            if (data.errors) {
                throw new Error(data.errors[0].message);
            }

            return data.data.addNewInvoice;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            return rejectWithValue(errorMessage);
        }
    }
);

export const updateInvoice = createAsyncThunk(
    'invoice/updateInvoice',
    async (invoice: any, { rejectWithValue }) => {
        try {
            const response = await fetch('http://localhost:5000/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: UPDATE_INVOICE.loc?.source.body,
                    variables: { invoice },
                }),
            });

            const data = await response.json();

            if (data.errors) {
                throw new Error(data.errors[0].message);
            }
            //console.log('GraphQL response:', data);
            return data.data.updateInvoice
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            return rejectWithValue(errorMessage);
        }
    }
);

export const deleteItem = createAsyncThunk(
    'invoice/deleteItem',
    async (theItemID: number, { rejectWithValue }) => {
        try {
            const response = await fetch('http://localhost:5000/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: DELETE_ITEM.loc?.source.body,
                    variables: { item_id: theItemID },
                }),
            });

            const data = await response.json();

            if (data.errors) {
                throw new Error(data.errors[0].message);
            }

            return data.data.updateInvoice;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred deleting the item';
            return rejectWithValue(errorMessage);
        }
    }
);

export const markInvoiceAsPaid = createAsyncThunk(
    'invoice/markInvoiceAsPaid',
    async (theInvoiceID: number, { rejectWithValue }) => {
        try {
            const response = await fetch('http://localhost:5000/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: MARK_PAID.loc?.source.body,
                    variables: { invoice_id: theInvoiceID },
                }),
            });

            const data = await response.json();

            if (data.errors) {
                throw new Error(data.errors[0].message);
            }

            return data.data.updateInvoice;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred deleting the item';
            return rejectWithValue(errorMessage);
        }
    }
);

// Redux Slice
const invoiceSlice = createSlice({
    name: "invoice",
    // initialState: { invoices: [], selectedInvoice: null, selectedUpdateInvoice: [], newInvoice: [], deletingItem: null, markedPaid: null, loading: false, error: "" },
    initialState,
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
        builder
            .addCase(updateInvoice.fulfilled, (state, action) => {
                state.loading = false;

                const updatedInvoice = action.payload;

                state.invoices = state.invoices.map(inv =>
                    inv.InvoiceID === updatedInvoice.InvoiceID
                        ? {
                            ...inv,
                            InvoicePaymentDue: updatedInvoice.InvoicePaymentDue,
                            ClientName: updatedInvoice.ClientName,
                            StatusName: updatedInvoice.StatusName,
                            InvoiceTotal: updatedInvoice.InvoiceTotal,
                        }
                        : inv
                );

                // also update the detail page state
                state.selectedInvoice = updatedInvoice;
            })
            .addCase(updateInvoice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Update failed";
            });

        builder
            .addCase(addNewInvoice.fulfilled, (state, action) => {
                console.log("New Invoice Payload:", action.payload);
                state.loading = false;
                if (action.payload) {
                    state.invoices = [...state.invoices, action.payload];
                    state.newInvoice = action.payload;
                }
            })
            .addCase(addNewInvoice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Add New Invoice failed";
            });

        builder
            .addCase(deleteItem.fulfilled, (state, action) => {
                state.loading = false;
                state.deletingItem = action.payload
            })
            .addCase(deleteItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Delete failed";
            });

        builder
            .addCase(markInvoiceAsPaid.fulfilled, (state, action) => {
                state.loading = false;
                state.markedPaid = action.payload
            })
            .addCase(markInvoiceAsPaid.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Mark as paid failed";
            });
    },
});

export default invoiceSlice.reducer;